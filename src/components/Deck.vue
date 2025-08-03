<template>
  <div class="deck">
    <div class="name">
      <input
        type="text"
        maxlength="12"
        v-model="props.deck.name"
        size="25"
        placeholder="输入卡组名称"
        style="font-weight: bold; font-size: 1vw; text-align: center; border: none"
      />
    </div>
    <div class="decklist">
      <div v-for="card in props.deck.cards" class="card">
        <span class="cropper">
          <img class="view" :src="getCardImg(card.name)" />
        </span>
        {{ card.cost }}k&ensp;
        <span @click="changeCard(card.id, props.deck, false)" class="cardname"
          ><b>{{ card.name }}</b></span
        >
        &ensp;x&ensp;
        <span @click="changeCard(card.id, props.deck, true)"
          ><b>{{ card.qty }}</b></span
        >
      </div>
    </div>
    <div class="count">
      <span>主国：{{ mainlength }}</span> <span>盟国：{{ alliedlength }}</span>
      <span>总数：{{ length }}</span
      ><button @click="cleanDeck">清除卡组</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { changeCard } from '@/utils/editor'
import { deck } from '@/utils/deck'
import { computed } from 'vue'

const props = defineProps<{ deck: deck }>()
const mainlength = computed(
  () =>
    props.deck.cards?.reduce(
      (sum, card) =>
        card.faction.some((f) => f === props.deck.mainFaction) ? sum + card.qty : sum,
      1,
    ) || 1,
)

const alliedlength = computed(
  () =>
    props.deck.cards?.reduce(
      (sum, card) =>
        !card.faction.some((f) => f === props.deck.mainFaction) &&
        card.faction.some((f) => f === props.deck.alliedFaction)
          ? sum + card.qty
          : sum,
      0,
    ) || 0,
)
const length = computed(() => mainlength.value + alliedlength.value)

function getCardImg(importName: string): string {
  return `./kards_cn/${importName.toUpperCase().replace(/\//g, '')}.png`
}

function cleanDeck(): void {
  props.deck.cards = []
}
</script>

<style scoped>
.deck {
  display: block;
}

.name {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6vh;
}

.decklist {
  height: 65vh;
  padding-top: 1vh;
  padding-bottom: 3vh;
  padding-left: 0.5vw;
  padding-right: 0.5vw;
  overflow: auto;
}

.count {
  height: 6vh;
  font-weight: lighter;
  font-size: 0.8vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.count button {
  font-size: 0.8vw;
}

.card {
  font-weight: 300;
  height: 2vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8vw;
}
.cardname {
  width: 10vw;
}

.cropper {
  height: 1.5vw;
  width: 1.5vw;
  display: inline-block;
  overflow: hidden;
  text-align: center;
}
.view {
  height: 80%;
  object-fit: contain;
  margin-top: 0.45em;
  transform: scale(2.7);
  transform-origin: center;
}
</style>
