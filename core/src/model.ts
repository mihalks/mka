import { Cell } from './cell';
import { Types } from './types';

export class Model {
  d: number;
  h: number;
  dt: number;
  a: number;

  constructor() {
    this.d = 0.000001;
    this.h = 0.002;
    this.dt = 0.1;
    this.a = this.calcA();
  }

  private calcA(): number {
    return this.d * (this.dt / this.h ** 2);
    //            Ci-1,j(t) - Ci,j(t)
    // J1(tk) = D--------------------
    //                   h^2
  }

  proccess(data: Cell[][]): Cell[][] {
    const result: Cell[][] = [];
    // Make as separate copy function
    for (const i in data) {
      result.push([]);
      for (const j in data[i]) {
        result[i].push({ ...data[i][j] });
      }
    }
    let dLeft: Cell;
    let dRight: Cell;
    let dBottom: Cell;
    let dTop: Cell;
    const height = data.length;
    if (height === 0) {
      return [];
    }
    const width = data[0].length;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (data[i][j].cellType === Types.Veshestvo) {
          // ?

          let siblings = 4;

          dTop = i > 0 ? { ...data[i - 1][j] } : { cellType: Types.Prepyatstvie, value: 0 };
          dBottom = i < height - 1 ? { ...data[i + 1][j] } : { cellType: Types.Prepyatstvie, value: 0 };

          dLeft = j > 0 ? { ...data[i][j - 1] } : { cellType: Types.Prepyatstvie, value: 0 };
          dRight = j < width - 1 ? { ...data[i][j + 1] } : { cellType: Types.Prepyatstvie, value: 0 };

          siblings = dLeft.cellType === Types.Prepyatstvie ? siblings - 1 : siblings; // добавить отдельный случай для препятствий
          siblings = dTop.cellType === Types.Prepyatstvie ? siblings - 1 : siblings; // ? надо будет проверить
          siblings = dRight.cellType === Types.Prepyatstvie ? siblings - 1 : siblings;
          siblings = dBottom.cellType === Types.Prepyatstvie ? siblings - 1 : siblings;

          // this.A = this.D * (this.dt / this.h**2);
          //            Ci-1,j(t) - Ci,j(t)
          // J1(tk) = D--------------------
          //                   h^2
          // SUMM J = J1 - J2 + J3 - J4

          // SUMM J = D*dt/h^2(  (Ci-1,j(t) - Ci,j(t)) -  (Ci,j(t) - Ci+1,j(t)) +  (Ci,j-1(t) - Ci,j(t)) - (Ci,j(t) - Ci,j+1(t)) )
          // SUMM J = D*dt/h^2(  Ci-1,j(t) - Ci,j(t) -  Ci,j(t) + Ci+1,j(t) +  Ci,j-1(t) - Ci,j(t) - Ci,j(t) + Ci,j+1(t) )
          // SUMM J = D*dt/h^2(  Ci-1,j(t) + Ci+1,j(t) + Ci,j-1(t) + Ci,j+1(t) - 4* Ci,j(t))
          // Ci,j(tk+1) = Ci,j(tk) + SUM Ji,j1

          // Ci,j(tk+1)      Ci,j(tk)
          const value =
            data[i][j].value +
            this.a * (dLeft.value + dRight.value + dBottom.value + dTop.value - siblings * data[i][j].value);
          result[i][j].value = value >= 0 ? value : 0;
        }
      }
    }

    dLeft = null;
    dRight = null;
    dTop = null;
    dBottom = null;
    return result;
  }
}
