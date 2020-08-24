import { createSelector } from 'reselect'
import { memoize } from 'lodash'

import {
  ConstShip,
  EquipData,
  GlobalStore,
  InfoEquip,
  InfoShipShip,
} from '../types/global-store.types'
import * as View from '../types/view.types'
import {
  EquipAerialType,
  getEquipAerialType,
  getSaku33,
  getTyku,
  getValueByLevel,
  isPresent,
} from '../utils/calc'
import { ShipEquipData, ShipSpeed } from '../types/common.types'
import {
  $shipSelectorFactory,
  dbShipSelectorFactory,
  equipToEquipDataSelectorFactory,
  shipEquipDataToEquipDataArraySelectorFactory,
  shipToShip$shipSelctorFactory,
  stateSelector,
} from './common'

export const equipToViewEquipSelectorFactory = memoize(
  (equip: InfoEquip, idx: number, $shipId: number) =>
    createSelector(
      [equipToEquipDataSelectorFactory(equip, idx, $shipId)],
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

export const shipInfoSelectorFactory = memoize((ship: ShipEquipData) =>
  createSelector(
    [stateSelector, shipEquipDataToEquipDataArraySelectorFactory(ship)],
    (state, equipsData): View.Ship => {
      const $shipId = ship.api_ship_id
      const $ship = $shipSelectorFactory($shipId)(state)
      const dbShip = dbShipSelectorFactory($shipId)(state)

      const equipSlots = ship.api_slot.filter(
        (_, idx) => idx < $ship.api_slot_num,
      )

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
          airSupremacy: getTyku([equipsData], 0),
        },
        equip: equipSlots.map((equip, idx) =>
          equip
            ? equipToViewEquipSelectorFactory(equip, idx, $shipId)(state)
            : null,
        ),
        equipx: ship.api_slot_ex
          ? equipToViewEquipSelectorFactory(
              ship.api_slot_ex,
              -1,
              $shipId,
            )(state)
          : null,
      }
    },
  ),
)

export const shipEquipDataArrayToFleetSelectorFactory = memoize(
  (data: (ShipEquipData | null)[], hqlv: number) => (
    state: GlobalStore,
  ): View.Fleet => {
    const ships = data.map((shipEquipData) =>
      shipEquipData ? shipInfoSelectorFactory(shipEquipData)(state) : null,
    )
    const airSupremacy: View.AirSupremacy = {
      min: ships
        .map((item) => item?.status.airSupremacy.min || 0)
        .reduce((p, c) => p + c, 0),
      max: ships
        .map((item) => item?.status.airSupremacy.max || 0)
        .reduce((p, c) => p + c, 0),
      basic: ships
        .map((item) => item?.status.airSupremacy.basic || 0)
        .reduce((p, c) => p + c, 0),
    }

    const _shipsData: ([InfoShipShip, ConstShip] | null)[] = data.map((ship) =>
      ship ? shipToShip$shipSelctorFactory(ship)(state) : null,
    )
    const shipsData = _shipsData.filter(isPresent)

    const _equipsData: (EquipData[] | null)[] = data.map((ship) =>
      ship ? shipEquipDataToEquipDataArraySelectorFactory(ship)(state) : null,
    )
    const equipsData = _equipsData.filter(isPresent)

    const los: View.Los = {
      x1: getSaku33(shipsData, equipsData, hqlv, 1, ships.length).total,
      x2: getSaku33(shipsData, equipsData, hqlv, 2, ships.length).total,
      x3: getSaku33(shipsData, equipsData, hqlv, 3, ships.length).total,
      x4: getSaku33(shipsData, equipsData, hqlv, 4, ships.length).total,
    }

    const _speed = ships.map((ship) => (ship ? ship.status.speed[1] : null))
    const speed: ShipSpeed = _speed
      .filter(isPresent)
      .reduce((a, b) => (a < b ? a : b), ShipSpeed.Unkwown)

    return {
      airSupremacy,
      los,
      speed,
      ships,
    }
  },
)
