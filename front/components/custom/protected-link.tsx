"use client"

import Link from "next/link"

interface Props {
  href: string
  children: React.ReactNode
}

export default function ProtectedLink({ href, children }: Props) {
  return <Link href={href}>{children}</Link>
}

