export const getValueByLevel = (min: number, max: number, lv: number): number =>
  Math.floor(((max - min) * lv) / 99) + min
