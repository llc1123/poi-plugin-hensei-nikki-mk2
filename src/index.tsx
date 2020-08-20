import React from 'react'
import { useSelector } from 'react-redux'
import { GlobalStore } from './types/global-store.types'
import * as View from './types/view.types'

const getValueByLevel = (min: number, max: number, lv: number): number =>
  Math.floor(((max - min) * lv) / 99) + min

const HenseiNikki: React.FC = () => {
  const hqLv = useSelector((state: GlobalStore) => state.info.basic.api_level)
  const infoFleets = useSelector((state: GlobalStore) => state.info.fleets)
  const $ships = useSelector((state: GlobalStore) => state.const.$ships)
  const ships = useSelector((state: GlobalStore) => state.info.ships)
  const shipDB = useSelector((state: GlobalStore) => state.wctf.ships)

  const getShipInfoById = (id: number): View.Ship => {
    const ship = ships[id]
    const $ship = $ships[ship.api_ship_id]
    return {
      id: ship.api_ship_id,
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
            shipDB[ship.api_ship_id].stat.evasion,
            shipDB[ship.api_ship_id].stat.evasion_max,
            ship.api_lv,
          ),
          ship.api_kaihi[0],
        ],
        aa: [$ship.api_tyku[0] + ship.api_kyouka[2], ship.api_taiku[0]],
        asw: [
          getValueByLevel(
            shipDB[ship.api_ship_id].stat.asw,
            shipDB[ship.api_ship_id].stat.asw_max,
            ship.api_lv,
          ) + ship.api_kyouka[6],
          ship.api_taisen[0],
        ],
        speed: [$ship.api_soku, ship.api_soku],
        los: [
          getValueByLevel(
            shipDB[ship.api_ship_id].stat.los,
            shipDB[ship.api_ship_id].stat.los_max,
            ship.api_lv,
          ),
          ship.api_sakuteki[0],
        ],
        luck: [$ship.api_luck[0] + ship.api_kyouka[4], ship.api_lucky[0]],
        range: [$ship.api_leng, ship.api_leng],
        airSupermacy: 0,
      },
      equip: [],
    }
  }
  const fleets = infoFleets.map((item) =>
    item.api_ship.filter((id) => id !== -1).map((id) => getShipInfoById(id)),
  )
  return (
    <div>
      <div>{hqLv}</div>
      {fleets.map((fleet) => (
        <div>{JSON.stringify(fleet)}</div>
      ))}
    </div>
  )
}

export const reactClass = HenseiNikki
