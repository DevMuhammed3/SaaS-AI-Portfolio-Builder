"use client";

import { Template } from "@/lib/services/templates-services";
import React from "react";

export default function TemplateThumbnail({
  template,
}: {
  template: Template;
}) {
  return (
    <div
      className="aspect-video bg-gradient-to-br rounded-t-lg relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${template?.primaryColor}, ${template?.secondaryColor})`,
      }}
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div className="absolute top-2 left-2 w-8 h-1 bg-white/50 rounded"></div>
      <div className="absolute top-4 left-2 w-12 h-1 bg-white/30 rounded"></div>
      <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/20 rounded"></div>
    </div>
  );
}
