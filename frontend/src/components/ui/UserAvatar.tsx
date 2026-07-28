"use client";

import React from "react";

interface UserAvatarProps {
  name: string;
  gender?: "MALE" | "FEMALE" | string;
  avatarUrl?: string;
  avatarIndex?: number;
  sizeClassName?: string;
  className?: string;
}

// 8 Male Avatar SVG paths stored in public/images/avatars/
const MALE_AVATAR_FILES = [
  "/images/avatars/avatar_01.svg",
  "/images/avatars/avatar_02.svg",
  "/images/avatars/avatar_03.svg",
  "/images/avatars/avatar_04.svg",
  "/images/avatars/avatar_05.svg",
  "/images/avatars/avatar_06.svg",
  "/images/avatars/avatar_07.svg",
  "/images/avatars/avatar_08.svg",
];

// 7 Female Avatar SVG paths stored in public/images/avatars/
const FEMALE_AVATAR_FILES = [
  "/images/avatars/avatar_09.svg",
  "/images/avatars/avatar_10.svg",
  "/images/avatars/avatar_11.svg",
  "/images/avatars/avatar_12.svg",
  "/images/avatars/avatar_13.svg",
  "/images/avatars/avatar_14.svg",
  "/images/avatars/avatar_15.svg",
];

export default function UserAvatar({
  name,
  gender = "MALE",
  avatarUrl,
  avatarIndex,
  sizeClassName = "h-9 w-9",
  className = "",
}: UserAvatarProps) {
  // If a direct avatarUrl is provided from backend, use it!
  let srcToUse = avatarUrl;

  if (!srcToUse) {
    // Determine gender by string or name matching
    const isFemale =
      gender.toUpperCase() === "FEMALE" ||
      gender.toLowerCase().includes("girl") ||
      gender.toLowerCase().includes("female font") ||
      gender.toLowerCase().includes("mrs") ||
      gender.toLowerCase().includes("ms") ||
      /sarah|maya|nusrat|farhana|aria|ayesha|sadia|rida|olivia|sophia|anika|sanjida|miftahul|tasnim|sumaiya|tasmia|fariha|samia|labiba|mahfuza|raihana|afia|humaira|mehzabin|nafisa|sabrina|tanjila|zarin|lamia|amanda|jenkins|jahan|begum/i.test(
        name
      );

    const charSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selectedIndex = avatarIndex !== undefined ? avatarIndex : charSum;
    const fileList = isFemale ? FEMALE_AVATAR_FILES : MALE_AVATAR_FILES;
    srcToUse = fileList[selectedIndex % fileList.length];
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={srcToUse}
      alt={`${name} Avatar`}
      className={`rounded-full object-cover shrink-0 ${sizeClassName} ${className}`}
      style={{
        objectFit: "cover",
        objectPosition: "center top",
        display: "block",
      }}
    />
  );
}
