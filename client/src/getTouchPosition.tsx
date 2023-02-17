// Copyright (c) 2021 Ivan Teplov

import { MouseEvent, TouchEvent } from 'react'
import MouseOrTouchEvent from './MouseOrTouchEvent'

export type Point = [x: number, y: number]

const touchPositionToArray = ({
  clientX,
  clientY,
}: {
  clientX: number
  clientY: number
}): Point => {
  return [clientX, clientY]
}

export const getTouchPosition = (
  event: MouseOrTouchEvent<HTMLCanvasElement>
): Point => {
  const { left, top } = event.currentTarget.getBoundingClientRect()

  let result

  if (event.type.startsWith('mouse')) {
    event = event as MouseEvent<HTMLCanvasElement>
    result = touchPositionToArray(event)
  } else {
    event = event as TouchEvent<HTMLCanvasElement>
    result = touchPositionToArray(event.touches[0])
  }

  return [result[0] - left, result[1] - top]
}

export default getTouchPosition
