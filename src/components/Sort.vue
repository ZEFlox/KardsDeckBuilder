<template>
  <div class="sort">
    <label>
      预备卡池
      <input type="checkbox" v-model="sortOptions.reserved" /> </label
    ><br />
    <label>
      费用：
      <select v-model.number="sortOptions.cost">
        <option value="-1">all</option>
        <option v-for="i of [0, 1, 2, 3, 4, 5, 6, 7]" :value="i">
          {{ i }}
        </option>
        <option value="8">8+</option>
      </select></label
    ><br />
    <label
      >国家：
      <select v-model.number="sortOptions.showfaction">
        <option value="0">all</option>
        <option value="1">main</option>
        <option value="2">allied</option>
      </select> </label
    ><br />
    <label
      >类型：
      <select v-model.number="sortOptions.type">
        <option value="">all</option>
        <option v-for="type of types" :value="type">{{ type }}</option>
      </select> </label
    ><br />
    <label
      >稀有度：
      <select v-model.number="sortOptions.rarity">
        <option value="">all</option>
        <option v-for="rarity of rarities" :value="rarity">{{ rarity }}</option>
      </select> </label
    ><br />
  </div>
</template>

<script setup lang="ts">
import { sortData, options } from '@/utils/sort'
import { ref, Ref, watch } from 'vue'

const props = defineProps<{ data: any; nation: string[] }>()

const types = ['infantry', 'tank', 'fighter', 'bomber', 'artillery', 'order', 'countermeasure']
const rarities = ['Standard', 'Limited', 'Special', 'Elite']

const sortOptions: Ref<options> = ref({
  addable: true,
  faction: props.nation,
  showfaction: 0,
  cost: -1,
  type: '',
  rarity: '',
  reserved: false,
})

watch(
  () => props.nation,
  (newNation) => {
    if (JSON.stringify(newNation) !== JSON.stringify(sortOptions.value.faction)) {
      sortOptions.value.faction = newNation
    }
  },
  { deep: true },
)

watch(
  () => ({ ...sortOptions.value }),
  () => {
    apply()
  },
  { deep: true },
)

const emit = defineEmits(['update:options'])
function apply(): void {
  console.log(sortOptions.value)

  const updatedoption = sortData(sortOptions.value)
  console.log(updatedoption)
  // 触发更新事件
  emit('update:options', updatedoption)
}

apply()
</script>
<style scoped>
.sort {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sort label {
  width: 15vw;
  display: flex;
  justify-content: space-between;
  font-size: 0.8vw;
}
.sort select {
  font-size: 0.8vw;
}
</style>
