import { Cell } from '@core/cell';
import { Types } from '@core/types';
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

interface MyCanvasProps {
  grid: Cell[][];
  pixelSize: number;
}

const MyCanvas: React.FC<MyCanvasProps> = ({grid, pixelSize}) => {
  const [lines, setLines] = useState<Array<{ tool: string; points: any[]; }>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = React.useState('pen');

 const [pixels, setPixels] = useState<Array<JSX.Element>>([]);

  // Function to generate pixels from the matrix
  const generatePixels = () => {
    const newPixels: Array<JSX.Element> = [];

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const cell = grid[y][x];
        let color = 'transparent';
        // Assign color based on cell type
        if (cell.cellType === Types.Source) {
          color = 'blue';
        } else if (cell.cellType === Types.Prepyatstvie) {
          color = 'red';
        } else if (cell.cellType === Types.Veshestvo) {
          // Interpolate the color based on the value (0 to 1)
          const intensity = Math.floor(cell.value * 255);
          color = `rgba(${intensity}, ${intensity}, ${intensity}, 1)`;
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
  }, [grid, pixelSize]);



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
