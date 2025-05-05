import { Contact, Container, Header, Introduce, Navigation, Search } from "@/components"
import withBaseTopping from "@/hocs/withBaseTopping"
import path from "@/ultils/path"
import clsx from "clsx"
import React, { useState } from "react"
import { Outlet } from "react-router-dom"

const Layout = ({ location }) => {
  const [isFixed, setIsFixed] = useState(false)
  const [isShowChatbot, setIsShowChatbot] = useState(false)
  return (
    <div
      onScroll={(e) => (e.target.scrollTop > 90 ? setIsFixed(true) : setIsFixed(false))}
      className="max-h-screen overflow-y-auto"
    >
      <Header />
      <div className={clsx(isFixed && "fixed z-[10000] top-0 left-0 right-0")}>
        <Navigation />
      </div>
      {!location.pathname.includes(path.DETAIL_POST) && <Search />}
      <div className="mx-auto h-full w-main">
        <Outlet />
      </div>
      <div className="flex flex-col mx-auto w-main gap-4">
        <Introduce />
        <Contact />
      </div>
      <div className="w-full h-[500px]"></div>
      <div className="fixed right-16 flex items-center justify-center bg-main-red rounded-full cursor-pointer drop-shadow bottom-12">
        {!isShowChatbot && (
          <img
            src="/chatbot.svg"
            alt="chatbot"
            className="w-20 h-20 object-cover border-main-red rounded-full border"
            onClick={() => setIsShowChatbot(true)}
          />
        )}
        {isShowChatbot && <Container setIsShowChatbot={setIsShowChatbot} />}
      </div>
    </div>
  )
}

export default withBaseTopping(Layout)
