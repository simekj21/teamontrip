<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'
// import Hotel from './components/Hotel.vue'
// import Crate from './components/Crate.vue'
import Room from './components/Room.vue'

const employeers = ref([
  {
    name: 'Jan Novak',
  },
  {
    name: 'Petr Skocil',
  },
  {
    name: 'Martin Zak',
  },
  {
    name: 'Karel Hrazdil',
  },
  {
    name: 'Jiri Sindler',
  },
  {
    name: 'Vaclav Nezval',
  },
])

const selectedEmployee = ref('nobody')

function startDrag(evt: any, index: number) {
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('itemID', index)
  
  console.log('Start drag ...', evt)
}

function dropEmployee(evt: any) {
  const itemID = evt.dataTransfer.getData('itemID')

  selectedEmployee.value = employeers.value[itemID].name
  console.log('Drop drop ...', evt)
  console.log('itemID:', itemID)
  console.log('Employee:', employeers.value[itemID].name)
}
</script>

<template>
  <room />

  <!-- <crate /> -->
  <!-- <ol>
    <li v-for="(employee,index) in employeers" :key="index"
        draggable="true"
        @dragstart="startDrag($event, index)"
        class="m-1 p-1 w-40 cursor-move border-2 border-slate-400 bg-slate-200 rounded-xl text-slate-500"
    >
      {{ index }}: {{ employee.name }}
    </li>
  </ol> -->

  <br>

  <!-- <div     
    class="w-56 h-56 bg-pink-200 rounded-lg"
    @dragover.prevent 
    @drop="dropEmployee"
  >
    {{ selectedEmployee }}
  </div> -->

  <!-- <hotel 
    :employeers="employeers"
  /> -->

</template>
  <!-- <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
