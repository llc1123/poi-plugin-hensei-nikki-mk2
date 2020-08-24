import React from 'react'
import { useSelector } from 'react-redux'
import {
  allAirBaseSelector,
  allFleetsShipsSelector,
} from './selectors/stateToData'

const HenseiNikki: React.FC = () => {
  const base = useSelector(allAirBaseSelector)
  const fleet = useSelector(allFleetsShipsSelector)

  return (
    <>
      <div>{JSON.stringify(base)}</div>
      <div>{JSON.stringify(fleet)}</div>
    </>
  )
}

export const reactClass = HenseiNikki
