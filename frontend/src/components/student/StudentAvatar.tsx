"use client";

import React from "react";

interface StudentAvatarProps {
  name: string;
  gender?: "MALE" | "FEMALE" | string;
  avatarUrl?: string;
  avatarIndex?: number;
  sizeClassName?: string;
}

// 8 Boy Avatar SVG paths from public/images/avatars/
const BOY_AVATAR_FILES = [
  "/images/avatars/avatar_01.svg",
  "/images/avatars/avatar_02.svg",
  "/images/avatars/avatar_03.svg",
  "/images/avatars/avatar_04.svg",
  "/images/avatars/avatar_05.svg",
  "/images/avatars/avatar_06.svg",
  "/images/avatars/avatar_07.svg",
  "/images/avatars/avatar_08.svg",
];

// 7 Girl Avatar SVG paths from public/images/avatars/
const GIRL_AVATAR_FILES = [
  "/images/avatars/avatar_09.svg",
  "/images/avatars/avatar_10.svg",
  "/images/avatars/avatar_11.svg",
  "/images/avatars/avatar_12.svg",
  "/images/avatars/avatar_13.svg",
  "/images/avatars/avatar_14.svg",
  "/images/avatars/avatar_15.svg",
];

export default function StudentAvatar({
  name,
  gender = "MALE",
  avatarUrl,
  avatarIndex,
  sizeClassName = "h-24 w-24",
}: StudentAvatarProps) {
  let avatarSrc = avatarUrl;

  if (!avatarSrc) {
    const isFemale =
      gender.toUpperCase() === "FEMALE" ||
      gender.toLowerCase().includes("girl") ||
      gender.toLowerCase().includes("female") ||
      /ayesha|sadia|rida|olivia|sophia|anika|sanjida|miftahul|tasnim|sumaiya|tasmia|fariha|nusrat|samia|labiba|mahfuza|raihana|afia|humaira|mehzabin|nafisa|sabrina|tanjila|zarin|lamia/i.test(name);

    const charSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selectedIndex = avatarIndex !== undefined ? avatarIndex : charSum;

    const fileList = isFemale ? GIRL_AVATAR_FILES : BOY_AVATAR_FILES;
    avatarSrc = fileList[selectedIndex % fileList.length];
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarSrc}
      alt={`${name} Avatar`}
      className={`rounded-full shrink-0 ${sizeClassName}`}
      style={{
        objectFit: "cover",
        objectPosition: "center top",
        display: "block",
      }}
    />
  );
}
