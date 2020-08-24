import { InfoEquip, InfoShipShip } from './global-store.types'

// FULL DESCRIPTION OF A SHIP
export interface ShipEquipData extends InfoShipShip {
  api_slot: (InfoEquip | null)[]
  api_slot_ex: InfoEquip | null
}

// A FLEET WITH SHIPS (NULL = EMPTY SLOT)
export type Fleet = (ShipEquipData | null)[]

export interface AirBaseSquadron {
  mode: AirType
  slot: (InfoEquip | null)[]
}

// FULL DESCRIPTION OF FLEETS
export interface Deck {
  hqlv: number
  fleets: (Fleet | null)[]
  airbase: AirBaseSquadron[]
}

// 速力　0 = 基地, 5 = 低速, 10 = 高速, 15 = 高速 +, 20 = 最速
export enum ShipSpeed {
  Base = 0,
  Slow = 5,
  Fast = 10,
  FastPlus = 15,
  Max = 20,
  Unkwown = 100,
}

// 射程　0 = 無, 1 = 短, 2 = 中, 3 = 長, 4 = 超長, 5 = 超長 +
export enum ShipRange {
  None = 0,
  Short = 1,
  Medium = 2,
  Long = 3,
  ExtraLong = 4,
  ExtraLongPlus = 5,
}

export enum AirType {
  Standby = 0, // 待機 退避 休息
  Attack = 1, // 出撃
  Defense = 2, // 防空
}
