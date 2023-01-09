<script setup lang="ts">
import { computed, ref, onMounted} from 'vue'
import { useStore } from 'vuex'
import Icon from './Icon.vue'

const emit = defineEmits(['focus-member'])

const store = useStore()
const team = computed(() => store.state.trip.team)

const selectedMember = ref('')

function focusMember(name) {
  
  if (name === selectedMember.value) {
    selectedMember.value = ''
    emit('focus-member', '')
    return
  }   

  selectedMember.value = name
  emit('focus-member', name)
}

function addMember() {
  let _newMember = prompt("Please enter name of new member", "Fantomas");

  if (_newMember !== null) {
    store.dispatch('addMember', _newMember)
  }
}

function delMember() {
  if (!selectedMember.value) return

  if (window.confirm(`Are you sure to delete ${selectedMember.value}?`)) {
    store.dispatch('delMember', selectedMember.value)
    selectedMember.value = ''
  }

}

function startDrag(evt: any, memberId: number, memberName: string) {
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('memberId', memberId)
  evt.dataTransfer.setData('member', memberName)
  
  // console.log('Start drag ...', evt)
}

onMounted(() => {
  console.log('Team started ...')
})

</script>

<template>

<div class="w-full md:w-60  flex flex-col justify-between border-2 border-gray-400">

  <div class="md:h-[700px] flex flex-col gap-1 md:overflow-y-scroll">
    <div
      v-for="(member,memberId) in store.state.trip.team" :key="memberId"
      class="p-1 bg-blue-400 text-center font-bold text-white cursor-pointer"
      :class="{
        'bg-amber-300': member.isInHotel,
        'border border-8 border-red-400': member.isInFlotila,
        'text-red-500': member.name === selectedMember,
      }"
      draggable="true"
      @dragstart="startDrag($event, memberId, member.name)"
      @click="focusMember(member.name)"
    >
      {{ member.name }}
    </div>
  </div>

  <div class="p-2 gap-1 flex flex-row justify-between bg-gray-400 text-white">
    <div class="self-center text-white font-bold">Aditis {{team.length}}</div>
    <div class="p-2 gap-1 flex flex-row bg-gray-400 text-white">
      <icon 
        name="account-plus-outline"
        tooltip="Pridat ucastnika!"
        @click="addMember()"
      />
      <icon 
        name="account-minus-outline"
        tooltip="Odebrat ucastnika! Nejprve je treba oznacit kliknutim!"
        @click="delMember()"
      />
    </div>
  </div>

</div>
</template>
