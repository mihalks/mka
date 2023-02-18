import { Cell } from '../src/cell';
import { Types } from '../src/types';
import { Model } from '../src/model';

describe('Проверка 1 шага распространения при наличии препятствия', () => {
  it('should calculate one step of simulation', () => {
    //   0 0 0
    // 0 3 2 # 0
    // 0 # # # 0
    // 0 # # # 0
    //   0 0 0

    // Expected
    // 0   0         0
    // 0   3      2  # 0
    // 0   0.025  #  # 0
    // 0   #      #  # 0
    // 0   0         0
    const grid: Cell[][] = [
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

    const expected: Cell[][] = [
      [
        { cellType: Types.Source, value: 1 },
        { cellType: Types.Prepyatstvie, value: 0 },
        { cellType: Types.Veshestvo, value: 0 },
      ],
      [
        { cellType: Types.Veshestvo, value: 0.025 },
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
    const result = model.proccess(grid);
    for (const i in result) {
      for (const j in result[i]) {
        expect(result[i][j].cellType).toEqual(expected[i][j].cellType);
        expect(result[i][j].value).toBeCloseTo(expected[i][j].value, 5);
      }
    }
  });
});
