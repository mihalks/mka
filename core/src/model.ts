import { Cell } from './cell';
import { Types } from './types';

export class Model {
  data: Cell[][];
  D: number;
  h: number;
  dt: number;
  A: number;

  constructor() {
    this.data = [];
    // this.width = 100;
    // this.height = 100;
    this.D = 0.000001;
    this.h = 0.002;
    this.dt = 0.1;
    this.A = this.calcA();
  }

  private calcA(): number {
    return this.D * (this.dt / this.h ** 2);
    //            Ci-1,j(t) - Ci,j(t)
    // J1(tk) = D--------------------
    //                   h^2
  }

  proccess(data: Cell[][]) {
    let buffer = data.slice();
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
        if (buffer[i][j].cellType === Types.Veshestvo) {
          // ?

          let siblings = 4;

          dTop = i > 0 ? buffer[i - 1][j] : { cellType: Types.Prepyatstvie, value: 0 };
          dBottom = i < height - 1 ? buffer[i + 1][j] : { cellType: Types.Prepyatstvie, value: 0 };

          dLeft = j > 0 ? buffer[i][j - 1] : { cellType: Types.Prepyatstvie, value: 0 };
          dRight = j < width - 1 ? buffer[i][j + 1] : { cellType: Types.Prepyatstvie, value: 0 };

          //   dLeft = dLeft == Types.Prepyatstvie ? 0 : dLeft;
          //   dRight = dRight == Types.Prepyatstvie ? 0 : dRight;
          //   dTop = dTop == Types.Prepyatstvie ? 0 : dTop;
          //   dBottom = dBottom == Types.Prepyatstvie ? 0 : dBottom;

          //   dLeft = dLeft == Types.Source ? 1 : dLeft; // ?
          //   dRight = dRight == Types.Source ? 1 : dRight;
          //   dTop = dTop == Types.Source ? 1 : dTop;
          //   dBottom = dBottom == Types.Source ? 1 : dBottom;

          siblings = dLeft.cellType === Types.Prepyatstvie ? siblings - 1 : siblings; // добавить отдельный случай для препятствий
          siblings = dTop.cellType === Types.Prepyatstvie ? siblings - 1 : siblings; // ? надо будет проверить
          siblings = dRight.cellType === Types.Prepyatstvie ? siblings - 1 : siblings;
          siblings = dBottom.cellType === Types.Prepyatstvie ? siblings - 1 : siblings;

          //   dLeft = dLeft == Types.Poglotitel ? 0 : dLeft;
          //   dRight = dRight == Types.Poglotitel ? 0 : dRight;
          //   dTop = dTop == Types.Poglotitel ? 0 : dTop;
          //   dBottom = dBottom == Types.Poglotitel ? 0 : dBottom;

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
          data[i][j].value =
            buffer[i][j].value +
            this.A * (dLeft.value + dRight.value + dBottom.value + dTop.value - siblings * buffer[i][j].value);
        }
      }
    }

    dLeft = null;
    dRight = null;
    dTop = null;
    dBottom = null;
    buffer = null;
  }
}
