import React, { useEffect, useState } from "react"
import { Button, InputForm, Select } from ".."
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import clsx from "clsx"
import { modal } from "@/redux/appSlice"
import { apiGetDistrictsFromProvinceId, apiGetWardsFromDistrictId } from "@/apis/app"

const SearchAddress = ({ getAddress }) => {
  const dispatch = useDispatch()
  const { datavn } = useSelector((state) => state.app)
  const {
    formState: { errors },
    setValue,
    watch,
    register,
    reset,
  } = useForm()
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const province = watch("province")
  const district = watch("district")
  const ward = watch("ward")
  const street = watch("street")
  const address = watch("address")
  const setCustomValue = (id, val) =>
    setValue(id, val, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  useEffect(() => {
    if (province) {
      setCustomValue("district", "")
      setCustomValue("ward", "")
      setCustomValue("street", "")
      const fetchDistricts = async () => {
        const response = await apiGetDistrictsFromProvinceId(province.province_id)
        if (response.status === 200) setDistricts(response.data.results)
      }
      fetchDistricts()
    }
  }, [province])
  useEffect(() => {
    if (district) {
      const fetchWards = async () => {
        const response = await apiGetWardsFromDistrictId(district.district_id)
        if (response.status === 200) setWards(response.data.results)
      }
      fetchWards()
    }
  }, [district])
  useEffect(() => {
    const text = clsx(
      street,
      street && ",",
      ward?.name,
      ward?.name && ",",
      district?.name,
      district?.name && ",",
      province?.name
    )
    const textModified = text
      ?.split(",")
      ?.map((el) => el.trim())
      ?.join(", ")
    setCustomValue("address", textModified)
  }, [province, district, ward, street])

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[650px] bg-white rounded-md p-4">
      <h1 className="text-lg font-bold tracking-tight pb-4 border-b">Tìm kiếm theo địa chỉ</h1>
      <div className="mt-6">
        <div className="grid grid-cols-3 gap-4">
          <Select
            options={datavn?.results?.map((el) => ({
              ...el,
              value: el.province_id,
              label: el.province_name,
              name: el.province_name,
            }))}
            onChange={(val) => setCustomValue("province", val)}
            value={province}
            className="col-span-1"
            label="Tỉnh/Thành phố"
          />
          <Select
            options={districts?.map((el) => ({
              ...el,
              value: el.district_id,
              label: el.district_name,
              name: el.district_name,
            }))}
            onChange={(val) => setCustomValue("district", val)}
            value={district}
            className="col-span-1"
            label="Quận/Huyện"
          />
          <Select
            options={wards?.map((el) => ({
              ...el,
              value: el.ward_id,
              label: el.ward_name,
              name: el.ward_name,
            }))}
            onChange={(val) => setCustomValue("ward", val)}
            value={ward}
            className="col-span-1"
            label="Phường/Xã"
          />
        </div>
        <div className="mt-4">
          <InputForm
            label="Đường/Phố/Số nhà"
            register={register}
            errors={errors}
            id="street"
            fullWidth
            placeholder="Nhập số nhà, đường, phố cụ thể"
            inputClassName="border-gray-300 placeholder:text-base"
          />
        </div>
        <div className="mt-6 flex items-center justify-center">
          <Button
            onClick={() => {
              getAddress(address)
              dispatch(modal({ isShowModal: false, modalContent: null }))
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SearchAddress
