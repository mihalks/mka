// Copyright (c) 2021 Ivan Teplov

import { brushSizes, BrushSizeButton } from './BrushSizeButton'
import { brushColors, BrushColorButton } from './BrushColorButton'
import { useEffect, useRef, useState } from 'react'
import { getTouchPosition } from './getTouchPosition'

import MouseOrTouchEvent from './MouseOrTouchEvent'
import ToolbarSection from './ToolbarSection'
import downloadFile from './downloadFile'

import './App.css'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Current brush size
  let [currentSize, setCurrentSize] = useState(brushSizes['Extra Large'])
  // Current brush color
  let [currentColor, setCurrentColor] = useState(brushColors.Blue)
  let isDrawing = false

  // Called when the user starts touching the canvas
  const startDrawing = (event: MouseOrTouchEvent<HTMLCanvasElement>) => {
    isDrawing = true

    const context = event.currentTarget.getContext('2d')!
    const point = getTouchPosition(event)

    // Start our line at the 'point' position
    context.beginPath()
    context.moveTo(...point)

    context.strokeStyle = currentColor
    context.lineWidth = currentSize
  }

  // Called when the user moves his finger/mouse along the canvas
  const continueDrawing = (event: MouseOrTouchEvent<HTMLCanvasElement>) => {
    // Is the user is not drawing (e.g. move a mouse without holding the left button)
    if (event.type === 'mousemove' && !isDrawing) {
      return
    }

    const context = event.currentTarget.getContext('2d')!
    const point = getTouchPosition(event)

    // Draw a line to our point
    context.lineTo(...point)
    context.stroke()
    // Close our path to prevent lines from being too sharp
    /*
      Explanation:
        In this implementation, we don't clear the canvas and redraw everything on every frame.
        So, when not closing the path and then calling context.stroke(), we redraw the path with one more point.
        Thus, line becomes sharp, since it's edges, which have alpha less than 1, after some amount of iterations
        will have alpha of 1.

        Here, our path consists of two points: the previous one and the current one.
        Thus, we don't draw same stroke multiple times, and line's 'edges' still have alpha less than 1.

        Hope this explanation makes sense :)
    */
    context.closePath()

    // Begin a new path, where the current point is the start
    context.beginPath()
    context.moveTo(...point)
  }

  // Called when the user stops touching the canvas
  const endDrawing = (event: MouseOrTouchEvent<HTMLCanvasElement>) => {
    isDrawing = false

    const context = event.currentTarget.getContext('2d')!
    context.closePath()
  }

  // Called when the user touches the 'clear' button
  const clearCanvas = () => {
    if (!canvasRef.current) return

    const context = canvasRef.current.getContext('2d')!
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
  }

  // Called when the user touches the 'save' button
  const saveCanvas = () => {
    if (!canvasRef.current) return

    const contents = canvasRef.current.toDataURL('image/png')
    downloadFile(contents, 'painting.png')
  }

  // Called when the app is initialized or when the window is being resized
  const onResize = () => {
    // If no canvas, return
    if (!canvasRef.current) return

    // Remove the attributes on canvas,
    // so that it fills the parent
    const canvas = canvasRef.current
    canvas.removeAttribute('width')
    canvas.removeAttribute('height')

    // Set the canvas' width to equal to the actual one,
    // so that it is not blurred because of scaling
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Make lines' starts and endings rounded,
    // and make them smoother
    const context = canvas.getContext('2d')!
    context.lineJoin = 'round'
    context.lineCap = 'round'

    // Fill the canvas background
    const canvasBackground = getComputedStyle(document.body).getPropertyValue(
      '--canvas-background'
    )

    context.fillStyle = canvasBackground
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'transparent'
  }

  // Call onResize when canvas is initialized
  useEffect(() => onResize(), [canvasRef])

  // Add event listener for window.onResize
  // when the app gets initialized
  useEffect(() => {
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="App column fill">
      <div className="Toolbar row">
        <ToolbarSection title="Painting">
          <button type="button" onClick={saveCanvas}>
            Save
          </button>
          <button type="button" onClick={clearCanvas}>
            Clear
          </button>
        </ToolbarSection>

        <ToolbarSection title="Brush size">
          {/* Buttons to select brush size */}
          {Object.entries(brushSizes).map(([sizeName, size]) => (
            <BrushSizeButton
              key={sizeName}
              onClick={() => setCurrentSize(size)}
              className={size === currentSize ? 'active' : ''}
              brushSize={sizeName}
            />
          ))}
        </ToolbarSection>

        <ToolbarSection title="Brush color">
          {Object.entries(brushColors).map(([colorName, color]) => (
            <BrushColorButton
              key={colorName}
              onClick={() => setCurrentColor(color)}
              className={color === currentColor ? 'active' : ''}
              brushColor={colorName}
            />
          ))}
        </ToolbarSection>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onTouchStart={startDrawing}
        onMouseMove={continueDrawing}
        onTouchMove={continueDrawing}
        onMouseUp={endDrawing}
        onTouchEnd={endDrawing}
        className="fill"
      />
    </div>
  )
}
