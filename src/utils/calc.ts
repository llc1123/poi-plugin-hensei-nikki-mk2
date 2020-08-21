export const getValueByLevel = (min: number, max: number, lv: number): number =>
  Math.floor(((max - min) * lv) / 99) + min

/*
  1 = 小口径主砲
  2 = 中口径主砲
  3 = 大口径主砲
  4 = 副砲
  5 = 魚雷
  6 = 艦上戦闘機
  7 = 艦上爆撃機
  8 = 艦上攻撃機
  9 = 艦上偵察機
  10 = 水上機
  11 = 電探
  12 = 対空強化弾
  13 = 対艦強化弾
  14 = 応急修理要員
  15 = 対空機銃
  16 = 高角砲
  17 = 爆雷
  18 = ソナー
  19 = 機関部強化
  20 = 上陸用舟艇
  21 = オートジャイロ
  22 = 対潜哨戒機
  23 = 追加装甲
  24 = 探照灯
  25 = 簡易輸送部材
  26 = 艦艇修理施設
  27 = 照明弾
  28 = 司令部施設
  29 = 航空要員
  30 = 高射装置
  31 = 対地装備
  32 = 水上艦要員
  33 = 大型飛行艇
  34 = 戦闘糧食
  35 = 補給物資
  36 = 特型内火艇
  37 = 陸上攻撃機
  38 = 局地戦闘機
  39 = 噴式戦闘爆撃機(噴式景雲改)
  40 = 噴式戦闘爆撃機(橘花改)
  41 = 輸送機材
  42 = 潜水艦装備
  43 = 水上戦闘機
  44 = 陸軍戦闘機
  45 = 夜間戦闘機
  46 = 夜間攻撃機
  47 = 陸上対潜哨戒機
*/

export enum EquipAerialType {
  NonAerial = 0,
  Aerial = 1,
  FlyingBoat = 2,
}

export const getEquipAerialType = (iconId: number): EquipAerialType => {
  if (iconId === 33) return EquipAerialType.FlyingBoat
  if (
    [6, 7, 8, 9, 10, 21, 22, 37, 38, 39, 40, 43, 44, 45, 46, 47].includes(
      iconId,
    )
  )
    return EquipAerialType.Aerial
  return EquipAerialType.NonAerial
}
