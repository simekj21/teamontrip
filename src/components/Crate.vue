<script setup lang="ts">
import { ref, onMounted } from 'vue';

// const box = ref({
//   name: '',
//   capacity: 0,
//   comment: '',
// })

const boxes = ref([])

const capacityRooms = 5

function getCapacity(capacity) {
  return capacity
}

onMounted(() => {
  console.log('%cSTARTED:','background-color:orange;color:white;',new Date().toLocaleTimeString())

  boxes.value = [
    {
      name: 'Pink room',
      capacity: 3,
      comment: 'Luxus',
    },
    {
      name: 'Blue room',
      capacity: 2,
      comment: 'Luxus',
    },
    {
      name: 'Normal room',
      capacity: 4,
      comment: '',
    },
    {
      name: 'Big room',
      capacity: 5,
      comment: 'Grande',
    },
  ]

  console.log('Boxes:', boxes.value)

})

</script>

<template>

<div class="flex flex-row">
  <div
    v-for="(box,index) in boxes" :key="index"
    class="p-4 m-2 border border-slate-400"
  >
    <div class="flex flex-col">
      <div
        v-for="n in box.capacity" :key="n"
        class="m-1 w-20 h-10 border-2"
      >
        {{  }}
        <svg style="width:24px;height:24px;color:lightgray;" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
        </svg>
      </div>
      
      <div class="flex flex-row">
        <svg style="width:24px;height:24px;color:lightgray;" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
        </svg>
        <svg style="width:24px;height:24px;color:lightgray;" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
      </div>

    </div>
  </div>


</div>

</template>

