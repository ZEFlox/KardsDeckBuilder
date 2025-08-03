import cardData from '@/data/kardsdata_navalwarfare.json'
import factionData from '@/data/faction.json'
import { sortDeck } from '@/utils/sort'
//获取卡池信息

//定义卡组格式
export interface card {
  name: string
  cost: number
  qty: number
  rty: number
  type: string
  faction: string[]
  spawn: string[]
  id: string
}
export interface deck {
  name: string
  mainFaction: string
  alliedFaction: string
  cards: card[]
}

//解析代码
function idParse(input: string): [number, number, string[][]] {
  // 整理格式
  input = input.replace(/\r|\n/g, '')
  const index = input.indexOf('%%')
  if (index === -1) throw new Error('未找到卡组代码')
  let str = input.substring(index + 2)

  // 提取国家
  const pipeIndex = str.indexOf('|')
  if (pipeIndex < 2) throw new Error('国家信息格式错误')
  const faction1 = parseInt(str.substring(0, 1), 10)
  const faction2 = parseInt(str.substring(1, 2), 10)
  if (isNaN(faction1) || isNaN(faction2)) throw new Error('国家编号解析失败')

  // 提取卡组
  const rest = str.substring(pipeIndex + 1)
  if (!rest) throw new Error('卡组中没有任何卡牌')
  const groupStrs = rest.split(';')
  const deck = groupStrs.map((g) => {
    const arr: string[] = []
    for (let i = 0; i < g.length; i += 2) {
      const id = g.substring(i, i + 2)
      arr.push(id)
    }
    return arr
  })

  return [faction1, faction2, deck]
}

export function addCard(cardId: string, idx: number, cardCount: any): void {
  const cardInfo = cardData.find((c: any) => c.importId === cardId)
  let name = `Unknown Card Id: ${cardId}`
  let cost = 0
  let faction = ['Unknown']
  let spawn = []
  let type = 'Unknown'
  let rty = 1
  let qty = 1
  if (cardInfo) {
    name = cardInfo.title_zh_Hans
    cost = parseInt(cardInfo.kredits)
    faction = cardInfo.faction
    spawn = cardInfo.spawn
    type = cardInfo.type
    rty =
      cardInfo.rarity === 'Standard'
        ? 4
        : cardInfo.rarity === 'Limited'
          ? 3
          : cardInfo.rarity === 'Special'
            ? 2
            : 1
    qty = idx
  }
  cardCount.push({
    name,
    cost,
    qty,
    rty,
    type,
    faction,
    spawn,
    id: cardId,
  })
}

//解析卡组
function getDeckInfo([faction1, faction2, deck]: [number, number, string[][]]): deck {
  // 获取主国和盟国名称
  const mainFaction: string = factionData[faction1 - 1]
  const alliedFaction: string = factionData[faction2 - 1]

  // 查找卡牌信息
  const cardCount: card[] = []
  deck.forEach((group, idx) => {
    group.forEach((cardId) => {
      addCard(cardId, idx + 1, cardCount)
    })
  })

  const name = '导入卡组'

  return {
    name,
    mainFaction,
    alliedFaction,
    cards: cardCount,
  }
}

//导入卡组
export function importDeck(input: string): deck {
  let deckInfo = getDeckInfo(idParse(input))
  sortDeck(deckInfo)
  return deckInfo
}

//导出卡组
export function exportDeck(deck: deck): string {
  if (deck.cards.length === 0) throw new Error('卡组数据无效或为空')
  let str: string = ``
  let arr: string[][] = [[], [], [], []]
  // 国家代码
  const mainFactionIndex = factionData.indexOf(deck.mainFaction) + 1
  const alliedFactionIndex = factionData.indexOf(deck.alliedFaction) + 1
  if (mainFactionIndex < 1 || alliedFactionIndex < 1) throw new Error('国家名称无效')

  // 卡组代码
  deck.cards.forEach((card) => {
    const idx = card.qty - 1
    arr[idx].push(card.id)
  })

  str += `${deck.name}: %%${mainFactionIndex}${alliedFactionIndex}|`
  str += arr.map((group) => group.join('')).join(';')

  return str
}
