export const BOXES = [
  {
    id: 1,
    label: 'Box 1',
    color: 'bg-amber-800',
    fromFirst100: 31,
    levelPerBox: 7,
    specialLevel: 350,
    jigsawPerBox: 2,
  },
  {
    id: 2,
    label: 'Box 2',
    color: 'bg-blue-700',
    fromFirst100: 11,
    levelPerBox: 19,
    specialLevel: 800,
    jigsawPerBox: 3,
  },
  {
    id: 3,
    label: 'Box 3',
    color: 'bg-yellow-500',
    fromFirst100: 1,
    levelPerBox: 41,
    specialLevel: 1500,
    jigsawPerBox: 5,
  },
] as const

export type BoxConfig = (typeof BOXES)[number]

export interface BoxResult {
  fromFirst100: number
  fromAbove100: number
  fromBonus: number
  totalBoxes: number
  totalJigsaw: number
}

export function calcBox(level: number, box: BoxConfig): BoxResult {
  const fromAbove100 = Math.floor((level - 100) / box.levelPerBox)
  const fromBonus = level >= box.specialLevel ? 30 : 0
  const totalBoxes = box.fromFirst100 + fromAbove100 + fromBonus
  const totalJigsaw = totalBoxes * box.jigsawPerBox
  return { fromFirst100: box.fromFirst100, fromAbove100, fromBonus, totalBoxes, totalJigsaw }
}
