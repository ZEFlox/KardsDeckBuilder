import cardData from '@/data/kardsdata_navalwarfare.json'
import { deck, addCard } from '@/utils/deck'

export function changeCard(
  id: string,
  deck: deck,
  mode: boolean, //true:加牌 false:减牌
): void {
  const cardInfo = cardData.find((card) => card.importId === id)
  if (!cardInfo || !id) return
  // 先查找是否已存在该卡牌
  for (const card of deck.cards) {
    if (card.id === id) {
      if (card.qty < card.rty && mode) {
        card.qty++
      }
      if (card.qty > 0 && !mode) {
        card.qty--
      }
      if (card.qty === 0) {
        deck.cards = deck.cards.filter((i) => i.id !== id)
      }
      return
    }
  }

  if (mode) {
    addCard(id, 1, deck.cards)
  }
}
