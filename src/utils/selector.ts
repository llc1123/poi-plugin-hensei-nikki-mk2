import { createSelector } from 'reselect'
import { memoize, times } from 'lodash'

import {
  ConstEquip,
  ConstShip,
  DBShip,
  EquipData,
  GlobalStore,
  InfoBasic,
  InfoEquip,
  InfoFleet,
  InfoShip,
  InfoShipShip,
} from '../types/global-store.types'
import * as View from '../types/view.types'
import {
  EquipAerialType,
  getEquipAerialType,
  getTyku,
  getValueByLevel,
  isPresent,
} from './calc'
import { Fleet, ShipEquipData } from '../types/common.types'

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

export const equipToEquip$equipSelectorFactory = memoize((equip: InfoEquip) =>
  createSelector([$equipsSelector], ($equips): [InfoEquip, ConstEquip] => [
    equip,
    $equips[equip.api_slotitem_id],
  ]),
)

export const equipToEquip$equipCountSelectorFactory = memoize(
  (equip: InfoEquip, idx: number, $shipId: number) =>
    createSelector(
      [$equipsSelector, $shipSelectorFactory($shipId)],
      ($equips, $ship): EquipData => {
        const $equip = $equips[equip.api_slotitem_id]
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

export const equipToViewEquipSelectorFactory = memoize(
  (equip: InfoEquip, idx: number, $shipId: number) =>
    createSelector(
      [equipToEquip$equipCountSelectorFactory(equip, idx, $shipId)],
      ([equip, $equip, count]: EquipData): View.Equip => {
        const iconId = $equip.api_type[3]
        const aerialType = getEquipAerialType(iconId)
        return {
          id: equip.api_slotitem_id,
          iconId,
          name: $equip.api_name,
          // hide the count if not aircraft
          count: aerialType === EquipAerialType.NonAerial ? -1 : count,
          mastery: equip.api_alv || 0,
          enhance: equip.api_level || 0,
        }
      },
    ),
)

export const shipToShip$shipSelctorFactory = memoize((ship: InfoShipShip) =>
  createSelector([$shipsSelector], ($ships) => {
    return [ship, $ships[ship.api_ship_id]]
  }),
)

export const shipInfoSelectorFactory = memoize(
  (ship: ShipEquipData) => (state: GlobalStore): View.Ship => {
    const $shipId = ship.api_ship_id
    const $ship = $shipSelectorFactory($shipId)(state)
    const dbShip = dbShipSelectorFactory($shipId)(state)

    const equipSlots = ship.api_slot.filter(
      (_, idx) => idx < $ship.api_slot_num,
    )

    const equipDataList: (EquipData | null)[] = [
      ...equipSlots.map((equip, idx) =>
        equip
          ? equipToEquip$equipCountSelectorFactory(equip, idx, $shipId)(state)
          : null,
      ),
      ship.api_slot_ex
        ? [...equipToEquip$equipSelectorFactory(ship.api_slot_ex)(state), 1]
        : null,
    ]

    const equipDataListNotNull = equipDataList.filter(isPresent)

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
        airSupremacy: getTyku([equipDataListNotNull], 0),
      },
      equip: equipSlots.map((equip, idx) =>
        equip
          ? equipToViewEquipSelectorFactory(equip, idx, $shipId)(state)
          : null,
      ),
      equipx: ship.api_slot_ex
        ? equipToViewEquipSelectorFactory(ship.api_slot_ex, -1, $shipId)(state)
        : null,
    }
  },
)

export const shipEquipDataSelectorFactory = memoize(
  (infoShip: InfoShip) => (state: GlobalStore): ShipEquipData => ({
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
      fleet.api_ship.map((shipId) => {
        if (shipId === -1) return null
        const ship = shipSelectorFactory(shipId)(state)
        return shipEquipDataSelectorFactory(ship)(state)
      }),
  ),
)

export const allFleetsShipsSelector = (state: GlobalStore): Fleet[] => [
  ...times(4).map((fleetId) => fleetShipsSelectorFactory(fleetId)(state)),
]
