import React, { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import Message from "./Message"
import Pending from "./Pending"

const Messages = () => {
  const { messages, isPending } = useSelector((s) => s.message)
  const lastEl = useRef()
  useEffect(() => {
    lastEl.current.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [messages])
  return (
    <div className="flex max-h-full h-full overflow-y-auto flex-col gap-2">
      {messages?.map((el, idx) => (
        <Message key={idx} {...el} />
      ))}
      {isPending && (
        <div className="flex items-end gap-2 justify-start">
          <img src="/chatbot.svg" alt="chatbot" className="w-6 h-6 rounded-full object-cover border border-main-blue" />
          <Pending />
        </div>
      )}
      <div ref={lastEl} className="w-full h-4"></div>
    </div>
  )
}

export default Messages
