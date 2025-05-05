import React, { useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { GoDotFill } from "react-icons/go"
import Messages from "./Messages"
import InputChat from "./InputChat"
import { Button } from ".."
import withBaseTopping from "@/hocs/withBaseTopping"
import { sendMessagesUser, start } from "@/redux/messageSlice"
import { getResponseChatbot } from "@/redux/actions"
import { useSelector } from "react-redux"

const Container = ({ setIsShowChatbot, dispatch }) => {
  // const [isStart, setIsStart] = useState(false)
  const { isStart } = useSelector((s) => s.message)
  const handleStartChat = (payload) => {
    dispatch(start())
    // Thêm thoại của USER
    dispatch(sendMessagesUser(payload))
    // Call API lấy RESPONSE cho BOT
    setTimeout(() => {
      dispatch(getResponseChatbot({ type: "MESSAGE", content: payload.trigger }))
    }, [1000])
  }
  return (
    <div className="w-[300px] rounded-md bg-white drop-shadow">
      <header className="px-2 py-3 bg-main-blue rounded-tl-md rounded-tr-md flex items-center justify-between font-semibold text-white">
        <div className="flex items-center gap-2">
          <span className="animate-ping">
            <GoDotFill color="#22c55e" />
          </span>
          <span>Chatbot CSKH</span>
        </div>
        <span
          onClick={() => {
            setIsShowChatbot(false)
          }}
          className="cursor-pointer"
        >
          <AiOutlineClose />
        </span>
      </header>
      {isStart && (
        <>
          <div className="bg-white border rounded-bl-md rounded-br-md h-[350px] grid grid-rows-6">
            <div className="row-span-5 h-full py-2">
              <Messages />
            </div>
            <div className="row-span-1 p-2 border-t flex items-center">
              <InputChat />
            </div>
          </div>
        </>
      )}
      {!isStart && (
        <div className="flex flex-col justify-center items-center h-[350px]">
          <img src="/logoshort.png" alt="logo" className="w-12 h-12 object-contain mb-4" />
          <span className="tracking-tight text-lg font-semibold text-main-blue">Phongtrosinhvien</span>
          <span className="text-sm">Chatbot hỗ trợ tìm kiếm</span>
          <Button onClick={() => handleStartChat({ text: "Bắt đầu", trigger: "GET_STARTED" })} className="mt-8">
            Bắt đầu
          </Button>
        </div>
      )}
    </div>
  )
}

export default withBaseTopping(Container)
