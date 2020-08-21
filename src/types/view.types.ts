import { ShipRange, ShipSpeed } from './common.types'
import { InfoEquip, InfoShipShip } from './global-store.types'

export interface ShipEquipData extends InfoShipShip {
  api_slot: (InfoEquip | null)[]
  api_slot_ex: InfoEquip | null
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
    airSupremacy: number
  }
  equip: (Equip | null)[]
  equipx: Equip | null
}

export interface Equip {
  id: number
  name: string
  count: number
  mastery: number
  enhance: number
}
