// Copyright (c) 2021 Ivan Teplov

import { MouseEvent, TouchEvent } from 'react'

/**
 * Type that combines MouseEvent and TouchEvent
 */
export type MouseOrTouchEvent<T> = MouseEvent<T> | TouchEvent<T>

export default MouseOrTouchEvent
