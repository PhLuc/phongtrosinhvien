const db = require("../models")
const asyncHandler = require("express-async-handler")
const { Op, Sequelize } = require("sequelize")
const { v4 } = require("uuid")

const handleMessage = asyncHandler(async (res, { content, data }) => {
  let response = []
  switch (content) {
    case "GET_STARTED":
      response = [
        { text: "Phòng trọ sinh viên xin chào!" },
        { text: `Chào mừng bạn đến thăm website của chúng tôi ~ ✨✨✨` },
        { text: `Trước khi bắt đầu xin phép cho web hỏi tên của bạn là gì?`, code: "ASK_NAME" },
      ]
      break
    case "ASK_NAME":
      response = [{ text: `Hi, ${data.userText}!` }, { text: `Bạn muốn tìm kiếm ở khu vực nào?`, code: "address" }]
      break
    case "address":
      response = [
        {
          text: `Bạn muốn được giúp đỡ tìm kiếm về vấn đề nào?`,
          options: [
            { id: v4(), value: "TIM_TRO", label: "Tìm trọ phù hợp" },
            { id: v4(), value: "TIM_O_GHEP", label: "Tìm người ở ghép" },
            // { id: v4(), value: "KHAC", label: "Khác" },
          ],
        },
      ]
      break
    case "TIM_TRO":
      response = [
        {
          code: "price",
          text: "Vui lòng cho Bot biết ngân sách hàng tháng của bạn để Bot có thể tìm kiếm các lựa chọn phù hợp?",
        },
      ]
      break
    case "price":
    case "ASK_OPTION":
      response = [
        {
          text: "Ngoài ra bạn còn cần thêm yêu cầu nào khác dưới đây không?",
          options: [
            { id: v4(), label: "Diện tích chỗ thuê", value: "AREA" },
            { id: v4(), label: "Chất lượng", value: "STAR" },
            { id: v4(), label: "Thêm thông tin khác", value: "DESCRIPTION" },
          ],
        },
      ]
      break
    case "AREA":
      response = [{ text: "Vui lòng nhập diện tích mà bạn mong muốn (m2)?", code: "area" }]
      break
    case "DESCRIPTION":
      response = [{ text: "Vui lòng nhập thêm mô tả mà bạn mong muốn?", code: "description" }]
      break
    case "STAR":
      response = [{ text: "Vui lòng nhập số sao tối thiểu mà bạn muốn (1⭐ - 5⭐)?", code: "star" }]
      break
    case "area":
    case "description":
    case "star":
      response = [
        {
          selects: {
            id: v4(),
            title: "Bạn cần thêm hoặc sửa yêu cầu không?",
            btns: [
              { value: "ASK_OPTION", label: "Thêm yêu cầu" },
              { value: "SEARCH", label: "Tìm kiếm" },
            ],
          },
        },
      ]
      break
    case "SEARCH":
      const { description, address, price, area, star, target } = data
      const queries = {}
      if (description) queries.description = { [Op.substring]: description }
      if (address) queries.address = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('address')), 'LIKE', '%' + address.toLowerCase() + '%')
      if (target) queries.target = target
      if (star) {
        const formatedStar = star.match(/\d+/g)
        if (formatedStar.length === 1 && (star.includes("lớn") || star.includes("trên"))) queries.star = { [Op.gte]: Number(formatedStar[0]) }
        else if (formatedStar.length === 1 && (star.includes("nhỏ") || star.includes("dưới"))) queries.star = { [Op.lte]: Number(formatedStar[0]) }
        else if (formatedStar.length > 1) {
          const arr = formatedStar?.map((el) => Number(el))
          queries.star = { [Op.between]: [arr[0], arr[1]] }
        } else queries.star = Number(formatedStar[0])
      }
      if (price) {
        const formatedPrice = price.match(/\d+/g)
        const unit = price.includes("triệu") ? 1000000 : 1
        if (formatedPrice.length === 1 && ( price.includes("lớn")||  price.includes("trên")))
          queries.price = { [Op.gte]: Number(formatedPrice[0]) * unit }
        else if (formatedPrice.length === 1 && (price.includes("nhỏ") || price.includes("dưới")))
          queries.price = { [Op.lte]: Number(formatedPrice[0]) * unit }
        else if (formatedPrice.length > 1) {
          const arr = formatedPrice?.map((el) => Number(el) * unit)
          queries.price = { [Op.between]: [arr[0], arr[1]] }
        } else queries.price = Number(formatedPrice[0] * unit)
      }
      if (area) {
        const formatedArea = area.match(/\d+/g)
        if (formatedArea.length === 1 && (area.includes("lớn") || area.includes("trên"))) queries.area = { [Op.gte]: Number(formatedArea[0]) }
        else if (formatedArea.length === 1 && (area.includes("nhỏ") || area.includes("dưới"))) queries.area = { [Op.lte]: Number(formatedArea[0]) }
        else if (formatedArea.length > 1) {
          const arr1 = formatedArea?.map((el) => Number(el))
          queries.area = { [Op.between]: [arr1[0], arr1[1]] }
        } else queries.area = Number(formatedArea[0])
      }
  
      const result = await db.Post.findAll({ where: queries, limit: 10, order: [["star", "DESC"]] })
      if (result && result.length > 0) {
        response = [
          {
            className: "list-post",
            postcard: result.map((el) => ({
              id: el.id,
              title: el.title,
              description: el.description,
              image: el.images[0],
              btns: [{ value: "DETAIL", label: "Xem chi tiết", end: true }],
            })),
          },
        ]
      } else
        response = [
          {
            text: "Rất tiếc hiện tại Bot không tìm thấy chỗ nghỉ nào thỏa mãn tất cả các yêu cầu của bạn 🥺. Vui lòng RESET lại yêu cầu và tìm lại nhé!",
          },
        ]

      break
    case "TIM_O_GHEP":
      response = [
        {
          text: "Đối tượng bạn muốn ở ghép là?",
          options: [
            { id: v4(), value: "TIM_TRO", label: "Nam" },
            { id: v4(), value: "TIM_TRO", label: "Nữ" },
            { id: v4(), value: "TIM_TRO", label: "Tất cả" },
          ],
          filterCode: "target",
        },
      ]
      break
    case "KHAC":
      response = []
      break
    default:
      response = [{ text: "Lựa chọn này chúng tôi chưa cập nhật, vui lòng chọn các option khác nhé ❤️" }]
      break
  }
  return res.json({
    success: true,
    messages: response,
  })
})
const endpoint = asyncHandler((req, res) => {
  const { type, content, data } = req.body
  const defautText = "Thao tác không được hỗ trợ. Vui lòng thử lại"
  if (type === "MESSAGE") return handleMessage(res, { content, data })
  return res.json({
    success: false,
    mes: defautText,
  })
})

module.exports = {
  endpoint,
}
