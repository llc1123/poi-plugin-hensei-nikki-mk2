import { createSelector } from 'reselect'
import { memoize } from 'lodash'

import { GlobalStore, InfoFleet, InfoShip } from '../types/global-store.types'
import {
  AirBaseSquadron,
  AirType,
  Fleet,
  ShipEquipData,
} from '../types/common.types'
import {
  airbaseSelector,
  equipSelectorFactory,
  fleetsSelector,
  shipSelectorFactory,
  stateSelector,
} from './common'

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

export const fleetShipsSelectorFactory = memoize(
  (fleet: InfoFleet) => (state: GlobalStore): Fleet =>
    fleet.api_ship.map((shipId) => {
      if (shipId === -1) return null
      const ship = shipSelectorFactory(shipId)(state)
      return shipEquipDataSelectorFactory(ship)(state)
    }),
)

export const allFleetsShipsSelector = createSelector(
  [fleetsSelector, stateSelector],
  (fleets, state): Fleet[] =>
    fleets.map((fleet) => fleetShipsSelectorFactory(fleet)(state)),
)

export const allAirBaseSelector = createSelector(
  [stateSelector, airbaseSelector],
  (state, airbase): AirBaseSquadron[] =>
    airbase.map((base) => ({
      mode:
        base.api_action_kind === 1
          ? AirType.Attack
          : base.api_action_kind === 2
          ? AirType.Defense
          : AirType.Standby,
      slot: base.api_plane_info.map((plane) =>
        plane.api_slotid === -1
          ? null
          : equipSelectorFactory(plane.api_slotid)(state),
      ),
    })),
)
