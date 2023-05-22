// Copyright (c) 2021 Ivan Teplov

import { brushSizes, BrushSizeButton } from './components/BrushSizeButton'
import { brushColors, BrushColorButton, Color } from './components/BrushColorButton'
import { useEffect, useRef, useState } from 'react'
import { getTouchPosition } from './components/getTouchPosition'

import MouseOrTouchEvent from './components/MouseOrTouchEvent'
import ToolbarSection from './components/ToolbarSection'
import downloadFile from './components/downloadFile'

import './App.css'
import {Model} from 'corets/src/model'
import  MyCanvas from './components/MyCanvas'

// const model = new Model();

const colors: Array<Color> = [
    {
        color: '#000',
        title: "Вещество" 
    },
    {
        color: '#dd2a2a',
        title: "Барьер" 
    },
    {
        color: '#129d12',
        title: "Поглотитель" 
    }, 
    {
        color: '#2875d5',
        title: "Источник" 
    }
]


export default function App() {
      const matrix = [
    [1, 2, -1],
    [2, -1, 1],
    [-1, 1, 2]
  ];
    return (
        <>
            <h1>Hello</h1>
            <MyCanvas  matrix={matrix} pixelSize={30}/>
        </>
    )
}
