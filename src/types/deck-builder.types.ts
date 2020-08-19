// デッキビルダーフォーマット

export interface DeckBuilderJSONObject {
  version: number // version = 4
  hqlv: number // 艦隊司令部Lv.
  f1?: Fleet
  f2?: Fleet
  f3?: Fleet
  f4?: Fleet
  a1?: Air
  a2?: Air
  a3?: Air
}

export interface Fleet {
  s1?: Ship
  s2?: Ship
  s3?: Ship
  s4?: Ship
  s5?: Ship
  s6?: Ship
  s7?: Ship
}

export interface Ship {
  id: number // 艦船ID
  lv: number // Lv
  hp: number // 最大HP
  luck: number // 運
  asw: number // 対潜
  items: {
    i1?: Item
    i2?: Item
    i3?: Item
    i4?: Item
    i5?: Item
    ix?: Item // 補強スロット
  }
}

export enum AirType {
  Standby = 0, // 待機 退避 休息
  Attack = 1, // 出撃
  Defense = 2, // 防空
}

export interface Air {
  mode: AirType
  items: {
    i1?: Item
    i2?: Item
    i3?: Item
    i4?: Item
  }
}

export interface Item {
  id: number // 装備ID
  rf: number // 改修Level
  mas: number // 艦載機熟練度
}
