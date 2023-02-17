// Copyright (c) 2021 Ivan Teplov

import { HTMLProps } from 'react'

interface ToolbarSectionProps extends HTMLProps<HTMLDivElement> {
  title: string
}

export default function ToolbarSection({
  title,
  children,
  ...props
}: ToolbarSectionProps) {
  return (
    <section className="ToolbarSection column fill" {...props}>
      <h2>{title}</h2>
      <div className="row buttonWrapper">{children}</div>
    </section>
  )
}
