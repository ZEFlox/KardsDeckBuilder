<template>
  <div class="toast-container"></div>
  <div id="iapp">
    <div id="title">
      <h3>Kards Deck Builder</h3>
    </div>
    <div id="ui" class="row">
      <div id="cards">
        <Cards :deck="currentDeck" :data="data" @update:deck="onDeckUpdate" />
      </div>

      <div id="sidebar">
        <span class="toolbar">
          主国:
          <select
            name="mainFaction"
            @change="sortDeck(currentDeck)"
            v-model="currentDeck.mainFaction"
          >
            <option value="Germany" :disabled="factionAble('Germany')">德</option>
            <option value="Britain" :disabled="factionAble('Britain')">英</option>
            <option value="Japan" :disabled="factionAble('Japan')">日</option>
            <option value="Soviet" :disabled="factionAble('Soviet')">苏</option>
            <option value="USA" :disabled="factionAble('USA')">美</option></select
          >&ensp; 盟国:
          <select
            name="mainFaction"
            @change="sortDeck(currentDeck)"
            v-model="currentDeck.alliedFaction"
          >
            <option value="Germany" :disabled="factionAble('Germany')">德</option>
            <option value="Britain" :disabled="factionAble('Britain')">英</option>
            <option value="Japan" :disabled="factionAble('Japan')">日</option>
            <option value="Soviet" :disabled="factionAble('Soviet')">苏</option>
            <option value="USA" :disabled="factionAble('USA')">美</option>
            <option value="France" :disabled="factionAble('France')">法</option>
            <option value="Italy" :disabled="factionAble('Italy')">意</option>
            <option value="Poland" :disabled="factionAble('Poland')">波</option>
            <option value="Finland" :disabled="factionAble('Finland')">芬</option></select
          >&ensp; <button @click="setView('sort')">筛选</button>&ensp;
          <button @click="setView('set')">关于</button>&ensp;
        </span>
        <Deck
          v-show="deckVisible"
          :deck="currentDeck"
          @update:deck="onDeckUpdate"
          class="sidecontent"
        />
        <Sort
          v-show="sortVisible"
          :data="data"
          :nation="[currentDeck.mainFaction, currentDeck.alliedFaction]"
          @update:options="onDataUpdate"
          class="sidecontent"
        />
        <Set v-show="setVisible" class="sidecontent" />
        <span class="toolbar">
          <input v-model="input" type="text" size="12" />&ensp;
          <button @click="importInput" id="import">导入卡组</button>&ensp;
          <button @click="exportInput" id="export">导出卡组</button>&ensp;
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cards from '@/components/Cards.vue'
import Deck from '@/components/Deck.vue'
import Sort from '@/components/Sort.vue'
import Set from '@/components/Set.vue'
import { importDeck, exportDeck, deck } from '@/utils/deck'
import { sortDeck } from '@/utils/sort'
import { ref, Ref, computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import { combineImages } from './utils/draw'
const { copy } = useClipboard()

let input: Ref<string> = ref('')
let currentDeck: Ref<deck> = ref({
  name: '',
  mainFaction: 'Germany',
  alliedFaction: 'France',
  cards: [],
})
let data = ref([])
let viewMode = ref('deck')
const deckVisible = computed(() => viewMode.value === 'deck')
const sortVisible = computed(() => viewMode.value === 'sort')
const setVisible = computed(() => viewMode.value === 'set')

//导入
function importInput(): void {
  if (input.value) {
    try {
      let deckInfo = importDeck(input.value)
      currentDeck.value = deckInfo
      console.log('Current Deck:', currentDeck.value)
      sortDeck(currentDeck.value)
    } catch (error) {
      console.error('Error importing deck:', error)
    }
  }
  input.value = ''
}

//导出
function exportInput(): void {
  console.log(currentDeck.value)
  if (currentDeck.value.cards.length !== 0) {
    try {
      console.log('Exporting deck:', currentDeck.value)
      showToast(
        `
      <div>导出方式：</div>
      <button class="copyascode">复制为代码</button><button class="copyasimg">下载为图片</button>
      `,
        0,
      )
    } catch (error) {
      console.error('Error exporting deck:', error)
      showToast(`导出失败:${error}`, 3000)
    }
  } else {
    showToast('卡组中没有任何牌', 1000)
  }
}

//呼出弹窗
function showToast(message: string, time: number): void {
  const container = document.querySelector('.toast-container')
  container.replaceChildren()
  const toast = document.createElement('div')
  toast.className = `toast`

  toast.innerHTML = `
    ${message}
    <button class="toast-close">&times;</button>
  `

  container.appendChild(toast)
  container.classList.add('show')

  let timer
  if (time != 0) {
    timer = setTimeout(() => {
      container.classList.remove('show')
      toast.remove()
    }, time)
  }
  if (toast.querySelector('.toast-close')) {
    toast.querySelector('.toast-close').addEventListener('click', () => {
      if (time != 0) clearTimeout(timer)
      container.classList.remove('show')
      toast.remove()
    })
  }
  if (toast.querySelector('.copyascode')) {
    toast.querySelector('.copyascode').addEventListener('click', () => {
      copy(exportDeck(currentDeck.value))
      showToast('复制成功', 3000)
    })
  }
  if (toast.querySelector('.copyasimg')) {
    toast.querySelector('.copyasimg').addEventListener('click', () => {
      combineImages(currentDeck.value, '')
      showToast('请等待...', 3000)
    })
  }
}
//边栏控制
function setView(type: string) {
  if (viewMode.value === type) viewMode.value = 'deck'
  else viewMode.value = type
}

//检查更新
function onDeckUpdate(newDeck): void {
  currentDeck.value = newDeck
  sortDeck(currentDeck.value)
  console.log(currentDeck.value)
}
function onDataUpdate(newData): void {
  if (JSON.stringify(data.value) !== JSON.stringify(newData)) {
    data.value = newData
    console.log('Data updated:', data.value)
  }
}

function factionAble(faction: string): boolean {
  const able =
    faction == currentDeck.value.mainFaction || faction == currentDeck.value.alliedFaction
  return able
}
</script>

<style>
html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#iapp {
  text-align: auto;
  margin-top: 2vh;
  margin-bottom: 2vh;
  margin-left: 6vw;
  margin-right: 6vw;
  bottom: 0;
  user-select: none;
}

#title {
  height: 5vh;
  font-size: 2vh;
  display: flex;
  align-items: center;
}

#ui {
  display: flex;
}

#cards {
  margin-top: 1vh;
  height: 90vh;
  width: 66vw;
  overflow: auto;
}
#sidebar {
  margin-top: 1vh;
  display: flex;
  height: 90vh;
  width: 22vw;
  align-items: center;
  flex-direction: column;
  overflow: auto;
}

.sidecontent {
  height: 82vh;
  width: 18vw;
}

.toolbar {
  display: flex;
  height: 4vh;
  width: 18vw;
  align-items: center;
  justify-content: space-between;
  font-size: 1vw;
}

.toolbar input,
.toolbar button,
.toolbar select {
  font-size: 0.7vw;
}

.toast-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
  display: none;
}

.toast-container.show {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
}

.toast {
  padding: 3em;
  background-color: white;
  border-style: solid;
  border: 0.1em black;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 1em;
}
.toast-close {
  position: absolute;
  top: 1em;
  right: 1em;
}
</style>
