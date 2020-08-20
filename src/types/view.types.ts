import { ShipRange, ShipSpeed } from './common.types'

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
    airSupermacy: number
  }
  equip: Equip[]
  equipx?: Equip
}

export interface Equip {
  id: number
  name: string
  count: number
  mastery: number
  enhance: number
}
