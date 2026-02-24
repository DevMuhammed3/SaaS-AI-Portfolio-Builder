"use client"

import dynamic from "next/dynamic"

const Story = dynamic(() => import("@/components/modules/landing/story"), {
  ssr: false,
})

export default function StoryClient({ videoUrl }: { videoUrl: string }) {
  return <Story videoUrl={videoUrl} />
}

