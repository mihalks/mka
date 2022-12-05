import { Cell } from "../src/cell";
import { Types } from "../src/types";
import { Model } from "../src/model";

describe('Example', () => {
  it('should return 5 as result of 2 and 3 sum', () => {
    const a = 3;
    const b = 2;
    expect(a + b).toEqual(5);
  });

  it('should calculate one step of simulation', () => {
    //  0 0 0
    //0 1 # # 0
    //0 # # # 0
    //0 # # # 0
    //  0 0 0

    const grid: Cell[][] = [
      [{ cellType: Types.Source, value: 1 }, { cellType: Types.Veshestvo, value: 0 }, { cellType: Types.Veshestvo, value: 0 }],
      [{ cellType: Types.Veshestvo, value:0 }, { cellType: Types.Veshestvo, value: 0 }, { cellType: Types.Veshestvo, value: 0 }],
      [{ cellType: Types.Veshestvo, value:0 }, { cellType: Types.Veshestvo, value: 0 }, { cellType: Types.Veshestvo, value: 0 }],
    ];
    const model = new Model();
    const result = model.proccess(grid);
    // Надо дальше сделать сравнение
  });
});

//  0 0 0
//0 # 0 # 0
//0 0 1 0 0
//0 # 0 # 0
//  0 0 0
