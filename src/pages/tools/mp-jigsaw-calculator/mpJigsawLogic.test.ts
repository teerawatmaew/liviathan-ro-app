import { describe, it, expect } from 'vitest'
import { calcBox, BOXES } from './mpJigsawLogic'

const [box1, box2, box3] = BOXES
// box1: fromFirst100=31, levelPerBox=7, specialLevel=350, jigsawPerBox=2
// box2: fromFirst100=11, levelPerBox=19, specialLevel=800, jigsawPerBox=3
// box3: fromFirst100=1,  levelPerBox=41, specialLevel=1500, jigsawPerBox=5

describe('calcBox', () => {
  describe('Box 1 (levelPerBox=7, specialLevel=350)', () => {
    it('level 101: 0 fromAbove100, no bonus', () => {
      const r = calcBox(101, box1)
      expect(r.fromFirst100).toBe(31)
      expect(r.fromAbove100).toBe(0)  // floor(1/7) = 0
      expect(r.fromBonus).toBe(0)
      expect(r.totalBoxes).toBe(31)
      expect(r.totalJigsaw).toBe(62)  // 31 × 2
    })

    it('level 107: exactly 1 batch of 7', () => {
      const r = calcBox(107, box1)
      expect(r.fromAbove100).toBe(1)  // floor(7/7) = 1
      expect(r.totalBoxes).toBe(32)
    })

    it('level 200: floor(100/7) = 14 fromAbove100', () => {
      const r = calcBox(200, box1)
      expect(r.fromAbove100).toBe(14)
    })

    it('level 349: no bonus (just below threshold)', () => {
      const r = calcBox(349, box1)
      expect(r.fromBonus).toBe(0)
    })

    it('level 350: triggers bonus +30', () => {
      const r = calcBox(350, box1)
      expect(r.fromBonus).toBe(30)
      expect(r.fromAbove100).toBe(35)   // floor(250/7) = 35
      expect(r.totalBoxes).toBe(31 + 35 + 30)
    })
  })

  describe('Box 2 (levelPerBox=19, specialLevel=800)', () => {
    it('level 119: exactly 1 batch of 19', () => {
      const r = calcBox(119, box2)
      expect(r.fromAbove100).toBe(1)
    })

    it('level 799: no bonus', () => {
      const r = calcBox(799, box2)
      expect(r.fromBonus).toBe(0)
    })

    it('level 800: triggers bonus', () => {
      const r = calcBox(800, box2)
      expect(r.fromBonus).toBe(30)
    })
  })

  describe('Box 3 (levelPerBox=41, specialLevel=1500)', () => {
    it('level 141: exactly 1 batch', () => {
      const r = calcBox(141, box3)
      expect(r.fromAbove100).toBe(1)
    })

    it('level 1499: no bonus', () => {
      const r = calcBox(1499, box3)
      expect(r.fromBonus).toBe(0)
    })

    it('level 1500: triggers bonus', () => {
      const r = calcBox(1500, box3)
      expect(r.fromBonus).toBe(30)
    })
  })

  it('totalJigsaw always equals totalBoxes × jigsawPerBox', () => {
    const testLevels = [101, 200, 350, 800, 1500]
    for (const box of BOXES) {
      for (const level of testLevels) {
        const r = calcBox(level, box)
        expect(r.totalJigsaw).toBe(r.totalBoxes * box.jigsawPerBox)
      }
    }
  })

  it('fromFirst100 is always the constant from box config', () => {
    for (const box of BOXES) {
      const r = calcBox(200, box)
      expect(r.fromFirst100).toBe(box.fromFirst100)
    }
  })
})
