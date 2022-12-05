import {Types} from './types'

export class Cell {
    cellType: Types;
    value? : number; // Потом нужно подумать - делать ли его необязательным
    // Подумать о добавлении сюда метода конвертации в цвет
}