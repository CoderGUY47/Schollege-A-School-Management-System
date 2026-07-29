import React from "react";

interface TakaIconProps {
  className?: string;
}

export default function TakaIcon({ className = "inline-block font-semibold" }: TakaIconProps) {
  return (
    <i className={`fa-solid fa-bangladeshi-taka-sign ${className}`} aria-hidden="true" />
  );
}
