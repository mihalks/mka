import './App.css'
// import { Model } from '../../core/src/model'
import { Model } from '@core/model'
import  MyCanvas from './components/MyCanvas'
import { Cell } from '@core/cell'
import { Types } from '@core/types';

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


export default function App() {
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


    const model = new Model();
    // Временный цикл -дальше обновлю правильно - с изменением состояния на каждем шаге моделирования
    for (let i=0; i < 20; i++){
        grid = model.proccess(grid);
        // модуль вычисления возвращает новую версию сетки -> можно сдеать таймлайн и мотать в разные стороны
    }
    return (
        <>
            <h1>Hello</h1>
            <MyCanvas  grid={grid} pixelSize={30}/>
        </>
    )
}
