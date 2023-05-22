import React, { useEffect, useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

interface MyCanvasProps {
  matrix: number[][];
  pixelSize: number;
}

const MyCanvas: React.FC<MyCanvasProps> = ({matrix, pixelSize}) => {
  const [lines, setLines] = useState<Array<{ tool: string; points: any[]; }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = React.useState('pen');

 const [pixels, setPixels] = useState<Array<JSX.Element>>([]);

  // Function to generate pixels from the matrix
  const generatePixels = () => {
    const newPixels: Array<JSX.Element> = [];

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        const value = matrix[y][x];
        let color = 'blue';

        // Assign color based on matrix value
        if (value === 1) {
          color = 'red';
        } else if (value === 2) {
          color = 'green';
        }

        // Create the pixel rectangle
        const pixel = (
          <Rect
            key={`${x}-${y}`}
            x={x * pixelSize}
            y={y * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill={color}
          />
        );

        newPixels.push(pixel);
      }
    }

    setPixels(newPixels);
  };


    // Generate pixels when the component mounts or when matrix or pixelSize changes
  useEffect(() => {
    generatePixels();
  }, [matrix, pixelSize]);



  const handleMouseDown = (e: any) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e:any) => {
    // no drawing - skipping
    if (!isDrawing) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <Stage
      width={500}
      height={500}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
    >
        <Layer>{pixels}</Layer>
        {/* {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="red"
            strokeWidth={2}
          />
        ))} */}
    </Stage>
  );
};

export default MyCanvas;
