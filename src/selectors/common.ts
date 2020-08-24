import { createSelector } from 'reselect'
import { memoize } from 'lodash'

import {
  ConstEquip,
  ConstShip,
  DBShip,
  EquipData,
  GlobalStore,
  InfoAirbase,
  InfoBasic,
  InfoEquip,
  InfoFleet,
  InfoShip,
  InfoShipShip,
} from '../types/global-store.types'
import { EquipAerialType, getEquipAerialType, isPresent } from '../utils/calc'
import { ShipEquipData } from '../types/common.types'

export const stateSelector = (state: GlobalStore): GlobalStore => state
export const basicSelector = (state: GlobalStore): InfoBasic => state.info.basic
export const fleetsSelector = (state: GlobalStore): InfoFleet[] =>
  state.info.fleets
export const airbaseSelector = (state: GlobalStore): InfoAirbase[] =>
  state.info.airbase
export const shipsSelector = (
  state: GlobalStore,
): { [key: number]: InfoShip } => state.info.ships
export const $shipsSelector = (
  state: GlobalStore,
): { [key: number]: ConstShip } => state.const.$ships
export const dbShipsSelector = (
  state: GlobalStore,
): { [key: number]: DBShip } => state.wctf.ships
export const equipsSelector = (
  state: GlobalStore,
): { [key: number]: InfoEquip } => state.info.equips
export const $equipsSelector = (
  state: GlobalStore,
): { [key: number]: ConstEquip } => state.const.$equips

export const hqLvSelector = createSelector(
  [basicSelector],
  (basic) => basic.api_level,
)
export const shipSelectorFactory = memoize((shipId: number) =>
  createSelector([shipsSelector], (ships) => ships[shipId]),
)
export const $shipSelectorFactory = memoize(($shipId: number) =>
  createSelector([$shipsSelector], ($ships) => $ships[$shipId]),
)
export const dbShipSelectorFactory = memoize(($shipId: number) =>
  createSelector([dbShipsSelector], (dbShips) => dbShips[$shipId]),
)
export const equipSelectorFactory = memoize((equipId: number) =>
  createSelector([equipsSelector], (equips) => equips[equipId]),
)
export const $equipSelectorFactory = memoize(($equipId: number) =>
  createSelector([$equipsSelector], ($equips) => $equips[$equipId]),
)

export const equipToEquip$equipSelectorFactory = memoize(
  (equip: InfoEquip) => (state: GlobalStore): [InfoEquip, ConstEquip] => [
    equip,
    $equipSelectorFactory(equip.api_slotitem_id)(state),
  ],
)

export const equipToEquipDataSelectorFactory = memoize(
  (equip: InfoEquip, idx: number, $shipId: number) =>
    createSelector(
      [stateSelector, $shipSelectorFactory($shipId)],
      (state, $ship): EquipData => {
        const $equip = $equipSelectorFactory(equip.api_slotitem_id)(state)
        const iconId = $equip.api_type[3]
        const aerialType = getEquipAerialType(iconId)
        // if no such idx meaning slot_ex then 1
        // I know aircrafts cannot be in slot_ex but who knows
        const count =
          aerialType === EquipAerialType.Aerial ? $ship.api_maxeq[idx] ?? 1 : 1
        return [equip, $equip, count]
      },
    ),
)

export const shipEquipDataToEquipDataArraySelectorFactory = memoize(
  (ship: ShipEquipData) => (state: GlobalStore): EquipData[] => {
    const $shipId = ship.api_ship_id
    const $ship = $shipSelectorFactory($shipId)(state)
    const equipSlots = ship.api_slot.filter(
      (_, idx) => idx < $ship.api_slot_num,
    )
    const equipDataList: (EquipData | null)[] = [
      ...equipSlots.map((equip, idx) =>
        equip
          ? equipToEquipDataSelectorFactory(equip, idx, $shipId)(state)
          : null,
      ),
      ship.api_slot_ex
        ? [...equipToEquip$equipSelectorFactory(ship.api_slot_ex)(state), 1]
        : null,
    ]

    return equipDataList.filter(isPresent)
  },
)

export const shipToShip$shipSelctorFactory = memoize(
  (ship: InfoShipShip) => (state: GlobalStore): [InfoShipShip, ConstShip] => {
    return [ship, $shipSelectorFactory(ship.api_ship_id)(state)]
  },
)
