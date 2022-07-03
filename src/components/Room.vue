<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ room: object }>()

const room = ref<object>({
  id: 0,
  beds: 2,
  sleepers: ['Jan','Karel']
})

const rooms = ref<object>([])

onMounted(() => {
  console.clear()
  console.log('Room:')
  console.table(room.value)

  rooms.value.push(room.value)
  rooms.value.push({
    id: 0,
    beds: 2,
    sleepers: ['Roman','Franta']
  })


  console.log('Hotel:')
  console.table(rooms.value)

})

</script>

<template>
 
</template>

<style scoped>

</style>
