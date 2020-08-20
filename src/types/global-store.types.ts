import { ShipRange, ShipSpeed } from './common.types'

export interface GlobalStore {
  const: {
    $ships: {
      [key: number]: ConstShip
    }
  }
  info: {
    basic: InfoBasic
    ships: {
      [key: number]: InfoShip
    }
    fleets: InfoFleet[]
    airbase: InfoAirbase[]
  }
  wctf: {
    ships: {
      [key: number]: DBShip
    }
  }
}

export interface ConstShip {
  api_id: number
  api_name: string
  api_taik: [number, number] // 耐久 [0]=初期値, [1]=最大値
  api_houg: [number, number] // 火力
  api_souk: [number, number] // 装甲
  api_raig: [number, number] // 雷装
  api_tyku: [number, number] // 対空
  api_soku: ShipSpeed // 速力
  api_luck: [number, number] // 運
  api_leng: ShipRange // 射程
}

export interface InfoBasic {
  api_level: number
}

export interface InfoShip {
  api_ship_id: number
  api_lv: number
  api_maxhp: number
  // 近代化改修状態　[0]=火力, [1]=雷装, [2]=対空, [3]=装甲, [4]=運, [5]=耐久, [6]=対潜
  api_kyouka: [number, number, number, number, number, number, number]
  api_karyoku: [number, number] // 火力 [0]=現在値(装備込み), [1]=最大値
  api_soukou: [number, number] // 装甲
  api_raisou: [number, number] // 雷装
  api_kaihi: [number, number] // 回避
  api_taiku: [number, number] // 対空
  api_taisen: [number, number] // 対潜
  api_soku: ShipSpeed // 速力
  api_sakuteki: [number, number] // 索敵
  api_lucky: [number, number] // 運
  api_leng: ShipRange // 射程
}

export interface InfoFleet {
  api_ship: number[]
}

export interface InfoAirbase {
  api_area_id: number // 所属海域ID
  api_rid: number // 航空隊ID
  api_name: string // 航空隊名
  api_distance: {
    api_base: number // 基礎半径
    api_bonus: number // 半径ボーナス
  }
  api_action_kind: number // 行動指示　0=待機, 1=出撃, 2=防空, 3=退避, 4=休息
  api_plane_info: InfoAirBasePlane[] // 中隊情報
}

export interface InfoAirBasePlane {
  api_slotid: number // 装備固有ID　0=なし
}

export interface DBShip {
  stat: {
    evasion: number
    evasion_max: number
    asw: number
    asw_max: number
    los: number
    los_max: number
  }
}
