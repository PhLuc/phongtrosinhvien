import clsx from "clsx"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

const Navigation = () => {
  const { categories } = useSelector((state) => state.app)
  return (
    <div className={clsx("bg-main-blue text-white font-medium h-10 flex items-center")}>
      <div className="w-main mx-auto flex items-center h-full">
        <NavLink
          to={""}
          className={({ isActive }) =>
            clsx("px-4 h-full flex items-center hover:bg-main-pink", isActive && "text-white bg-main-pink")
          }
        >
          Trang chủ
        </NavLink>
        {categories?.map((el) => (
          <NavLink
            key={el.id}
            to={el.slug}
            className={({ isActive }) =>
              clsx("px-4 ml-[-8px] h-full flex items-center hover:bg-main-pink", isActive && "text-white bg-main-pink")
            }
          >
            {el.value}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Navigation
