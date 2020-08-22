import React from 'react'
import { useSelector, useStore } from 'react-redux'
import { GlobalStore } from './types/global-store.types'
import {
  allFleetsShipsSelector,
  hqLvSelector,
  shipInfoSelectorFactory,
} from './utils/selector'

const HenseiNikki: React.FC = () => {
  const hqLv = useSelector(hqLvSelector)
  const fleets = useSelector(allFleetsShipsSelector)
  const store = useStore<GlobalStore>()

  return (
    <div>
      <div>{hqLv}</div>
      {/* <div>{JSON.stringify(fleets)}</div> */}
      {fleets.map((fleet) =>
        fleet.map((ship) =>
          ship === null ? null : (
            <div>
              {JSON.stringify(shipInfoSelectorFactory(ship)(store.getState()))}
            </div>
          ),
        ),
      )}
    </div>
  )
}

export const reactClass = HenseiNikki
