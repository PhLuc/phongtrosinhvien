import withBaseTopping from "@/hocs/withBaseTopping"
import { getResponseChatbot } from "@/redux/actions"
import { sendMessagesUser, updateDataChatbot } from "@/redux/messageSlice"
import clsx from "clsx"
import React from "react"
import { useSelector } from "react-redux"
import { twMerge } from "tailwind-merge"
import { Slider } from ".."
import path from "@/ultils/path"
import DOMPurify from "dompurify"

const Message = ({ text, isBot, navigate, options, dispatch, selects, postcard, filterCode }) => {
  // console.log({ postcard, className })
  const { dataChatbot } = useSelector((s) => s.message)
  const handleSubmit = ({ text, content }) => {
    dispatch(sendMessagesUser({ text }))
    if (filterCode) dispatch(updateDataChatbot({ [filterCode]: text }))
    const payload = { content, type: "MESSAGE" }
    if (content === "SEARCH") payload.data = dataChatbot
    setTimeout(() => {
      dispatch(getResponseChatbot(payload))
    }, 1000)
  }
  return (
    <div className={twMerge(clsx("w-full px-2 flex items-end gap-2", isBot ? "justify-start" : "justify-end"))}>
      {isBot && (
        <img src="/chatbot.svg" alt="chatbot" className="w-6 h-6 rounded-full object-cover border border-main-blue" />
      )}
      {text && (
        <div className={twMerge(clsx("p-2 rounded-md max-w-[80%]", isBot ? "bg-gray-200" : "bg-main-blue text-white"))}>
          <span>{text}</span>
          {options && (
            <div className="flex items-center mt-2 gap-2 flex-wrap">
              {options?.map((el) => (
                <span
                  key={el.id}
                  onClick={() => handleSubmit({ text: el.label, content: el.value })}
                  className="px-3 bg-gray-100 text-sm py-1 border border-main-blue rounded-l-full rounded-r-full"
                >
                  {el.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {selects && (
        <div className="bg-gray-200 p-2  rounded-md flex flex-col gap-2">
          <h3 className="font-medium leading-5 text-gray-800">{selects?.title}</h3>
          {selects?.btns?.map((el) => (
            <button
              onClick={() => handleSubmit({ text: el.label, content: el.value })}
              className="p-2 rounded-md font-medium bg-gray-500 text-white"
              key={el.value}
            >
              {el.label}
            </button>
          ))}
        </div>
      )}
      {postcard && (
        <div className="w-[220px]">
          <Slider wrapAround={false} className="bg-transparent w-full" count={1}>
            {postcard?.map((item) => (
              <div key={item.id} className="bg-gray-200 w-full rounded-md flex flex-col gap-2">
                <img src={item.image} alt="av" className="w-full h-[120px] object-cover rounded-tl-md rounded-tr-md" />
                <div className="p-2 w-full flex flex-col gap-2">
                  <h3 className="font-medium line-clamp-1 leading-5 text-gray-800">{item?.title}</h3>
                  <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item?.description)}} className="text-xs line-clamp-2 text-gray-700" />
                  {item?.btns?.map((el) => (
                    <button
                      onClick={() =>
                        el.value === "DETAIL"
                          ? window.open(`/${path.DETAIL_POST}/${item.id}/${item.title}`, "_blank")
                          : handleSubmit({ text: el.label, content: el.value })
                      }
                      className="p-2 rounded-md font-medium bg-gray-500 text-white"
                      key={el.value}
                    >
                      {el.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  )
}

export default withBaseTopping(Message)
