import cardData from '@/data/kardsdata_navalwarfare.json'
import { deck } from '@/utils/deck'

export interface options {
  addable: boolean
  faction: string[]
  showfaction: number
  cost: number
  type: string
  rarity: string
  reserved: boolean
}

//卡池筛选
function sortByAddable(input: boolean, data: any): any {
  if (!input) {
    return data
  }
  const sortCardData = data.filter((card) => card.set != 'OnlySpawnable')
  return sortCardData
}

function sortByNation(faction: string[], showfaction: number, data: any): any {
  if (!faction || faction.length === 0) {
    return data
  }
  const sortCardData = data.filter(
    (card) =>
      (card.faction.some((f) => f === faction[0]) && (showfaction == 0 || showfaction == 1)) ||
      (card.faction.some((f) => f === faction[1]) &&
        card.rarity !== 'Elite' &&
        (showfaction === 0 || showfaction === 2)),
  )
  return sortCardData
}

function sortByType(type: string, data: any): any {
  if (type === '') {
    return data
  }
  const sortCardData = data.filter((card) => type === card.type)
  return sortCardData
}

function sortByCost(cost: number, data: any): any {
  let sortCardData
  if (cost == -1) {
    return data
  } else if (cost >= 8) {
    sortCardData = data.filter((card) => parseInt(card.kredits) >= 8)
  } else sortCardData = data.filter((card) => parseInt(card.kredits) == cost)
  return sortCardData
}

function sortByRarity(rarity: string, data: any): any {
  if (rarity === '') {
    return data
  }
  const sortCardData = data.filter((card) => rarity === card.rarity)
  return sortCardData
}

function sortByReserved(input: boolean, data: any): any {
  if (input) {
    return data
  }
  const sortCardData = data.filter((card) => card.reserved === 'FALSE')
  return sortCardData
}

export function sortData(input: options): any {
  let data = cardData
  data = sortByAddable(input.addable, data)
  data = sortByNation(input.faction, input.showfaction, data)
  data = sortByType(input.type, data)
  data = sortByCost(input.cost, data)
  data = sortByRarity(input.rarity, data)
  data = sortByReserved(input.reserved, data)
  const sortCardData = data
  return sortCardData
}

export function sortDeck(deck: deck): void {
  // 按 cardData 顺序排序
  const idOrderMap = new Map<string, number>()
  cardData.forEach((card, idx) => idOrderMap.set(card.importId, idx))
  function byCardDataOrder(a: any, b: any) {
    return (idOrderMap.get(a.id) ?? 99999) - (idOrderMap.get(b.id) ?? 99999)
  }
  deck.cards.sort(byCardDataOrder)
}
