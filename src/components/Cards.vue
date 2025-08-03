<template>
  <div class="card-gallery">
    <div class="card-list">
      <div v-for="card in props.data" :key="card.importId" class="card-item">
        <div style="position: relative; width: 100%; height: 100%">
          <img
            v-if="!imgError[card.importId] && !imgLoading[card.importId]"
            :src="getCardImg(card.title_zh_Hans)"
            :alt="card.title_zh_Hans"
            class="card-img"
            @error="onImgError(card.importId)"
            @load="onImgLoad(card.importId)"
            @click="handleCardChange(card.importId, true)"
            style="position: absolute; left: 0; top: 0"
          />
          <div
            v-else-if="imgLoading[card.importId]"
            class="card-img card-img-placeholder"
            style="
              position: absolute;
              left: 0;
              top: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #aaa;
              background: #f5f5f5;
            "
          >
            加载中...
          </div>
          <div
            v-else
            class="card-img card-img-placeholder"
            @click="handleCardChange(card.importId, true)"
            style="
              position: absolute;
              left: 0;
              top: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #aaa;
              background: #f5f5f5;
            "
          >
            加载失败
          </div>
        </div>
        <div class="card-name" :id="card.title_zh_Hans">{{ card.title_zh_Hans }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { changeCard } from '@/utils/editor'
import { deck } from '@/utils/deck'

const props = defineProps<{
  deck: deck
  data: any
}>()

function getCardImg(importName: string) {
  return `./kards_cn/${importName.toUpperCase().replace(/\//g, '')}.png`
}

// 图片加载处理
const imgError = ref<Record<string, boolean>>({})
const imgLoading = ref<Record<string, boolean>>({})

function onImgError(id: string) {
  imgError.value[id] = true
  imgLoading.value[id] = false
}
function onImgLoad(id: string) {
  imgLoading.value[id] = false
}
onMounted(() => {
  if (props.data) {
    props.data.forEach((card) => {
      imgError.value[card.importId] = false
      imgLoading.value[card.importId] = true
    })
  }
})

const emit = defineEmits(['update:deck'])
function handleCardChange(id: string, mode: boolean) {
  const updatedDeck = JSON.parse(JSON.stringify(props.deck))
  changeCard(id, updatedDeck, mode)

  // 触发更新事件
  emit('update:deck', updatedDeck)
}
</script>

<style scoped>
.card-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2vw;
  justify-content: flex-start;
  padding-top: 1vw;
  padding-bottom: 3vw;
}

.card-item {
  width: 9vw;
  height: 12.6vw;
  text-align: center;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-img-placeholder {
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-size: 1.1vw;
}

.card-name {
  width: 100%;
  font-size: 0.7vw;
  text-align: center;
  margin-top: 0.3vw;
}
</style>
