"use client";
import { Toaster } from "@/components/ui/sonner";
import * as React from "react";

const ToasterProvider = () => {
  return <Toaster position="top-center" duration={10000} closeButton={true} />;
};

export default ToasterProvider;
