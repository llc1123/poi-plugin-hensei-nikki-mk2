import React from 'react'
import { useSelector } from 'react-redux'
import { GlobalStore } from './types/global-store.types'

const HenseiNikki: React.FC = () => {
  const state = useSelector((state: GlobalStore) => state)
  return <div>{JSON.stringify(state.info)}</div>
}

export const reactClass = HenseiNikki
