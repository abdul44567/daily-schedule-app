"use client";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: React.CSSProperties;
  title?: string
};

function Button({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  style,
  title,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{...style, cursor: "pointer"}}
      title={title}
    >
      {children}
    </button>
  );
}

export default Button;
