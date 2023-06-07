import './App.css'
// import { Model } from '../../core/src/model'
import { Model } from '@core/model'
import MyCanvas from './components/MyCanvas'
import { Cell } from '@core/cell'
import { Types } from '@core/types';
import { useEffect, useState } from 'react';

// const model = new Model();

// const colors: Array<Color> = [
//     {
//         color: '#000',
//         title: "Вещество" 
//     },
//     {
//         color: '#dd2a2a',
//         title: "Барьер" 
//     },
//     {
//         color: '#129d12',
//         title: "Поглотитель" 
//     }, 
//     {
//         color: '#2875d5',
//         title: "Источник" 
//     }
// ]

let grid: Cell[][] = [
    [
        { cellType: Types.Source, value: 1 },
        { cellType: Types.Prepyatstvie, value: 0 },
        { cellType: Types.Veshestvo, value: 0 },
    ],
    [
        { cellType: Types.Veshestvo, value: 0 },
        { cellType: Types.Veshestvo, value: 0 },
        { cellType: Types.Veshestvo, value: 0 },
    ],
    [
        { cellType: Types.Veshestvo, value: 0 },
        { cellType: Types.Veshestvo, value: 0 },
        { cellType: Types.Veshestvo, value: 0 },
    ],
];


export default function App() {

    const model = new Model();
    const [grd, setGrid] = useState<Cell[][]>([])
    const [stepCount, setStepCount] = useState(0);

    useEffect(() => {
        setGrid(grid);
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setGrid((prevGrid) => model.proccess(prevGrid));
            setStepCount((prevCount) => prevCount + 1);
        }, 10);

        if (stepCount >= 1000) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <h1>Hello</h1>
            <MyCanvas grid={grd} pixelSize={50} />
        </>
    )
}
