"use client";

// import { Sprout } from "lucide-react";
import React from "react";
import { LocaleLink } from "./locale-link";
import Image from "next/image";

export default function Logo() {
  return (
    <LocaleLink href="/" className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
        <Image
          src="/images/logo_dark.svg"
          width={0}
          height={0}
          className="h-5 w-5"
          alt="logo"
          priority={false}
        />
      </div>
      <span className="font-bold text-xl text-primary-500">10minportfolio</span>
    </LocaleLink>
  );
}
