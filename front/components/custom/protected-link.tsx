"use client"

import Link from "next/link"

interface Props {
  href: string
  children: React.ReactNode
  className?: string
}

export default function ProtectedLink({ href, children }: Props) {
  return <Link href={href}>{children}</Link>
}

