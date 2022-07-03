<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ employeers: any }>()

var selectedEmployeer = ref('test')

function dropEmployeeToRoom(evt: any) {
  const itemID = evt.dataTransfer.getData('itemID')

  // selectedEmployee.value = employeers.value[itemID].name
  console.log('Drop drop ...', evt)
  console.log('itemID:', itemID)

  selectedEmployeer.value = props.employeers[itemID].name
  
  console.log('Employee:', props.employeers[itemID].name)
  console.log('Employee:', selectedEmployeer.value)
}
</script>

<template>
   <div     
    class="w-56 h-56 bg-green-300 rounded-lg"
    @dragover.prevent 
    @drop="dropEmployeeToRoom"
  > 
    {{ selectedEmployeer }}
  </div>
</template>

<style scoped>

</style>
