import { Types } from './types';

export class Cell {
  cellType: Types;
  value: number; // Нужно подумать - делать ли его необязательным
  // Можно добавить сюда потом метод конвертации в цвет

  constructor(type: Types, value: number) {
    this.cellType = type;
    this.value = value;
  }
}
