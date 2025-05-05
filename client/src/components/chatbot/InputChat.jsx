import withBaseTopping from "@/hocs/withBaseTopping"
import { getResponseChatbot } from "@/redux/actions"
import { end, reset, sendMessagesUser, updateDataChatbot } from "@/redux/messageSlice"
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { SlOptionsVertical } from "react-icons/sl"

const InputChat = ({ dispatch }) => {
  const inputChatRef = useRef()
  const { currentCode, dataChatbot } = useSelector((s) => s.message)
  const [isShowOption, setIsShowOption] = useState(false)
  const optionRef = useRef()
  const handleSendInput = () => {
    const userText = inputChatRef.current.textContent
    dispatch(sendMessagesUser({ text: userText }))
    dispatch(updateDataChatbot({ [currentCode]: userText }))
    dispatch(getResponseChatbot({ type: "MESSAGE", content: currentCode || "EXCEPTION", data: { userText } }))
    inputChatRef.current.textContent = ""
  }

  console.log(dataChatbot)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!optionRef.current?.contains(e.target)) setIsShowOption(false)
    }
    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])
  return (
    <div ref={optionRef} className="grid grid-cols-10 gap-2 w-full">
      <div
        data-text="Chat somethings..."
        contentEditable="true"
        className="col-span-8 p-2 outline-none bg-gray-200 rounded-md"
        ref={inputChatRef}
      />
      <div className="col-span-2 border-l flex gap-1 items-center justify-between">
        <div
          onClick={handleSendInput}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
        >
          <img src="/send.svg" alt="send" className="w-6 h-6 object-cover" />
        </div>
        <div onClick={() => setIsShowOption(!isShowOption)} className="cursor-pointer relative">
          {isShowOption && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-8 right-0 min-w-[100px] rounded-md bg-white drop-shadow"
            >
              <span
                onClick={() => dispatch(reset())}
                className="cursor-pointer font-semibold hover:text-main-blue w-full inline-block hover:bg-gray-100 p-3 border-b"
              >
                Reset
              </span>
              <span
                onClick={() => dispatch(end())}
                className="cursor-pointer font-semibold hover:text-main-blue inline-block hover:bg-gray-100 p-3 whitespace-nowrap border-b"
              >
                Kết thúc chat
              </span>
            </div>
          )}
          <SlOptionsVertical />
        </div>
      </div>
    </div>
  )
}
//aok

export default withBaseTopping(InputChat)
