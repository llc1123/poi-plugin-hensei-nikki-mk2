declare module 'views/utils/game-utils' {
  import('./types/global-store.types')
  import('./types/common.types')
  import {
    ConstEquip,
    ConstShip,
    InfoEquip,
    InfoShipShip,
    EquipData,
  } from './types/global-store.types'
  import { AirType } from './types/common.types'

  export function getSaku33(
    shipsData: [InfoShipShip, ConstShip][],
    equipsData: EquipData[][],
    teitokuLv: number,
    mapModifier: number,
    slotCount: number,
  ): {
    ship: number
    item: number
    teitoku: number
    total: number
  }
  export function getTyku(
    equipsData: EquipData[][],
    landbaseStatus: AirType,
  ): {
    basic: number
    min: number
    max: number
  }
}
