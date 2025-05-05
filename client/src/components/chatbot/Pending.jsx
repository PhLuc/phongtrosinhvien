import React from "react"
import { ThreeDots } from "react-loader-spinner"

const Pending = () => {
  return (
    <div className="w-12 h-6 rounded-md bg-gray-200 flex items-center justify-center">
      <ThreeDots
        height="30"
        width="30"
        radius="6"
        color="#fff"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  )
}

export default Pending
