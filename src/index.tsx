import React from 'react'
import { useSelector } from 'react-redux'
import { allFleetsShipsSelector, hqLvSelector } from './utils/selector'

const HenseiNikki: React.FC = () => {
  const hqLv = useSelector(hqLvSelector)
  const fleets = useSelector(allFleetsShipsSelector)

  return (
    <div>
      <div>{hqLv}</div>
      <div>{JSON.stringify(fleets)}</div>
    </div>
  )
}

export const reactClass = HenseiNikki
