import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`border rounded-xl px-4 py-2 focus:outline-none focus:ring focus:border-blue-500 ${className}`}
      {...props}
    />
  );
}
