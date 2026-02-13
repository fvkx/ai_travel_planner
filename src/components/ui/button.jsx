import React from "react"

export function Button({
  children,
  className = "",
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl shadow hover:shadow-md transition border bg-black text-white ${className}`}
    >
      {children}
    </button>
  )
}
