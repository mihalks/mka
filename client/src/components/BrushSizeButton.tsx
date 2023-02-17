// Copyright (c) 2021 Ivan Teplov

import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

/**
 * Brush sizes available in the app
 */
export const brushSizes = {
  'Ultra Small': 2,
  Small: 4,
  Medium: 6,
  Large: 8,
  'Extra Large': 10,
}

export function getSize(brushSizeName: string): number {
  return (brushSizes as any)[brushSizeName]
}

interface BrushSizeButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  brushSize: string
}

/**
 * Button to select the brush size
 */
export function BrushSizeButton({
  brushSize,
  className,
  ...props
}: BrushSizeButtonProps) {
  return (
    <button
      type="button"
      title={brushSize}
      className={'BrushSizeButton ' + (className ?? '')}
      {...props}
    >
      <span style={{ width: getSize(brushSize) + 'px' }} />
    </button>
  )
}

export default BrushSizeButton
