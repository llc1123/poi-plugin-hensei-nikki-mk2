import { ShipRange, ShipSpeed } from './common.types'

export interface AirSupremacy {
  basic: number
  min: number
  max: number
}

export interface Los {
  x1: number
  x2: number
  x3: number
  x4: number
}

export interface Equip {
  id: number
  iconId: number
  name: string
  count: number
  mastery: number
  enhance: number
}

export interface Ship {
  id: number
  name: string
  lv: number
  status: {
    hp: number
    firepower: [number, number] // 火力 [装備なし, 装備込み]
    armor: [number, number]
    torpedo: [number, number]
    evasion: [number, number]
    aa: [number, number]
    asw: [number, number]
    speed: [ShipSpeed, ShipSpeed]
    los: [number, number]
    luck: [number, number]
    range: [ShipRange, ShipRange]
    airSupremacy: AirSupremacy
  }
  equip: (Equip | null)[]
  equipx: Equip | null
}

export interface Fleet {
  airSupremacy: AirSupremacy
  los: Los
  ships: (Ship | null)[]
}
