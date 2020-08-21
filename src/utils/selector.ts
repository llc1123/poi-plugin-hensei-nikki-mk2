import { createSelector } from 'reselect'
import { memoize, times } from 'lodash'

import {
  ConstEquip,
  ConstShip,
  DBShip,
  GlobalStore,
  InfoBasic,
  InfoEquip,
  InfoFleet,
  InfoShip,
} from '../types/global-store.types'
import * as View from '../types/view.types'
import { EquipAerialType, getEquipAerialType, getValueByLevel } from './calc'

export const stateSelector = (state: GlobalStore): GlobalStore => state
export const basicSelector = (state: GlobalStore): InfoBasic => state.info.basic
export const fleetsSelector = (state: GlobalStore): InfoFleet[] =>
  state.info.fleets
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

export const fleetSelectorFactory = memoize((fleetId: number) =>
  createSelector([fleetsSelector], (fleets) => fleets[fleetId]),
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

export const infoEquipToViewEquipSelectorFactory = memoize(
  (equip: InfoEquip, idx: number, $ship: ConstShip) => (
    state: GlobalStore,
  ): View.Equip => {
    const $equip = $equipSelectorFactory(equip.api_slotitem_id)(state)
    const iconId = $equip.api_type[3]
    const aerialType = getEquipAerialType(iconId)
    const count =
      aerialType === EquipAerialType.NonAerial
        ? -1
        : aerialType === EquipAerialType.FlyingBoat
        ? 1
        : $ship.api_maxeq[idx]
    return {
      id: equip.api_slotitem_id,
      iconId,
      name: $equip.api_name,
      count,
      mastery: equip.api_alv || 0,
      enhance: equip.api_level || 0,
    }
  },
)

export const shipInfoSelectorFactory = memoize(
  (ship: View.ShipEquipData) => (state: GlobalStore): View.Ship => {
    const $shipId = ship.api_ship_id
    const $ship = $shipSelectorFactory($shipId)(state)
    const dbShip = dbShipSelectorFactory($shipId)(state)

    return {
      id: $shipId,
      name: $ship.api_name,
      lv: ship.api_lv,
      status: {
        hp: ship.api_maxhp,
        firepower: [
          $ship.api_houg[0] + ship.api_kyouka[0],
          ship.api_karyoku[0],
        ],
        armor: [$ship.api_souk[0] + ship.api_kyouka[3], ship.api_soukou[0]],
        torpedo: [$ship.api_raig[0] + ship.api_kyouka[1], ship.api_raisou[0]],
        evasion: [
          getValueByLevel(
            dbShip.stat.evasion,
            dbShip.stat.evasion_max,
            ship.api_lv,
          ),
          ship.api_kaihi[0],
        ],
        aa: [$ship.api_tyku[0] + ship.api_kyouka[2], ship.api_taiku[0]],
        asw: [
          getValueByLevel(dbShip.stat.asw, dbShip.stat.asw_max, ship.api_lv) +
            ship.api_kyouka[6],
          ship.api_taisen[0],
        ],
        speed: [$ship.api_soku, ship.api_soku],
        los: [
          getValueByLevel(dbShip.stat.los, dbShip.stat.los_max, ship.api_lv),
          ship.api_sakuteki[0],
        ],
        luck: [$ship.api_luck[0] + ship.api_kyouka[4], ship.api_lucky[0]],
        range: [$ship.api_leng, ship.api_leng],
        airSupremacy: 0,
      },
      equip: ship.api_slot
        .filter((_, idx) => idx < $ship.api_slot_num)
        .map((equip, idx) =>
          equip
            ? infoEquipToViewEquipSelectorFactory(equip, idx, $ship)(state)
            : null,
        ),
      equipx: ship.api_slot_ex
        ? infoEquipToViewEquipSelectorFactory(
            ship.api_slot_ex,
            -1,
            $ship,
          )(state)
        : null,
    }
  },
)

export const shipEquipDataSelectorFactory = memoize(
  (infoShip: InfoShip) => (state: GlobalStore): View.ShipEquipData => ({
    ...infoShip,
    //eslint-disable-next-line @typescript-eslint/camelcase
    api_slot: infoShip.api_slot.map((equipId) => {
      if (!equipId) return null
      return equipSelectorFactory(equipId)(state)
    }),
    //eslint-disable-next-line @typescript-eslint/camelcase
    api_slot_ex:
      infoShip.api_slot_ex > 0
        ? equipSelectorFactory(infoShip.api_slot_ex)(state)
        : null,
  }),
)

export const fleetShipsSelectorFactory = memoize((fleetId: number) =>
  createSelector(
    [stateSelector, fleetSelectorFactory(fleetId)],
    (state, fleet) =>
      fleet.api_ship
        .filter((shipId) => shipId !== -1)
        .map((shipId) => {
          const ship = shipSelectorFactory(shipId)(state)
          const shipEquip = shipEquipDataSelectorFactory(ship)(state)
          return shipInfoSelectorFactory(shipEquip)(state)
        }),
  ),
)

export const allFleetsShipsSelector = (state: GlobalStore): View.Ship[][] => [
  ...times(4).map((fleetId) => fleetShipsSelectorFactory(fleetId)(state)),
]
