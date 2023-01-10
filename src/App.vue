<script setup lang="ts">
import { onMounted, ref, unref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import Hotel from './components/Hotel.vue'
import Members from './components/Members.vue';
import Flotila from './components/Flotila.vue';

const store = useStore()  
const trip = computed(() => store.state.trip)
const setTrip = (trip) => store.dispatch('setTrip', trip)

const memberName = ref('')
const moduleShowConfig = ref({
  team: true,
  hotel: true,
  flotila: true,
  import: false,
})
const exportelm = ref(null)
const importelm = ref(null)
const importedTrip = ref(null)

function saveTrip() {
  localStorage.setItem('trip', JSON.stringify(trip.value))
  alert('Trip SAVED!!!')
}

function exportTrip() {
  exportelm.value.select()
  navigator.clipboard.writeText(exportelm.value.value)
  alert('Export: Ctrl-V ziskate data')
}

function importTrip() {
  // console.log("Imported:", importedTrip.value)

  // if (confirm('Chcete opravdu importovat?')) {
    navigator.clipboard.readText().then(
      (clipText) => {

        console.log('ClipText:', clipText)

        if (clipText.includes('team')) {
          let newTrip = JSON.parse(clipText)
          setTrip(newTrip)
        } else {
          alert('Spatny format importu!')
        }

    })
  // }

}

onBeforeMount(() => {
  console.log('onBeforeMount')
  if ( !JSON.parse(window.localStorage.getItem('trip')) ) {
    console.log('Trip not found....')

    let _membersStr = "Adámek Radim,Dvořák Antonín,Trachtová Dagmar,Mihálová Sabina,Špirit Petr,Demková Michaela,Dvořák Roman,Kolmačková Lucie,Boháč Václav,Koutník Matěj,Plšek Jaroslav,Merta Patrik,Růžičková Jitka,Šimková Lenka,Pavlůsek Radim,Smolinka Martin,Zavadil Martin,Škrla Petr,Pavlíková Michaela,Šklíba Martin,Kučera Stanislav,Smolková Kateřina,Vlčková Iva,Kubín Petr,Gorec Radomír,Brovjáková Květoslava,Šulová Michaela,Kubíčková Monika,Zbořil Tomáš,Suchý Lukáš,Šülli Nicolas,Stohrová Anna,Chalupková Klára,Hrkal Pavel,Czajtanyi Róbert,Ryšavý Michal"
    let _trip = {
      team: [],
      hotel: [],
      flotila: []
    }

    _membersStr.split(',').forEach( member => {
      _trip.team.push({
        name: member,
        isInHotel: false,
        room: 0,		
        bed: 0,		
        isInFlotila: false,		
        car: 0,		
        seat: 0,
      })
    })

    let _roomsSet = [1,2,2,2,2,2,2,2,3,3,4,4,4]
    let _sleepers = []

    _roomsSet.forEach( n => {
        _sleepers.length = n
        _sleepers.fill('')

        _trip.hotel.push({
            sleepers: [..._sleepers],
            beds: n,
            bathroom: true,
            kitchen: false,
            extrabed: false,
            familyroom: false,
            comment: 'Hotelovy pokoj',
        })
    })

    _trip.flotila.push({
      seats: ['','','','',''],
      color: 'blue',
      comment: 'Dacia Duster'
    })
   
    _trip.flotila.push({
      seats: ['','','','',''],
      color: 'red',
      comment: 'Skoda Yetti'
    })

    setTrip(_trip)

    localStorage.setItem('trip', JSON.stringify(_trip))
  } else {
    console.log('Trip to load')
    const loadTrip = JSON.parse(window.localStorage.getItem('trip'))
    setTrip(loadTrip)
  }
})
</script>

<template>
<div class="overflow-scroll flex flex-col">

  <div class="select-none hover:animate-pulse p-4 text-4xl text-white font-bold bg-gradient-to-r via-purple-500 from-cyan-500 to-blue-500">
      TEAM ON TRIP
  </div>
  
  <div class="flex flex-col">
    <div class="mb-6 p-2 gap-6 flex flex-row justify-between bg-gray-400 text-white">
      
      <div class="flex flex-row gap-4">
        <svg 
          style="width:40px;height:40px" 
          viewBox="0 0 24 24"
          class="text-white cursor-pointer"
          :class="{'text-red-400':!moduleShowConfig.team}"
          @click="moduleShowConfig.team = !moduleShowConfig.team"
        >
          <path fill="currentColor" d="M16.5 15.5C18.22 15.5 20.25 16.3 20.5 16.78V17.5H12.5V16.78C12.75 16.3 14.78 15.5 16.5 15.5M16.5 14C14.67 14 11 14.92 11 16.75V19H22V16.75C22 14.92 18.33 14 16.5 14M9 13C6.67 13 2 14.17 2 16.5V19H9V17.5H3.5V16.5C3.5 15.87 6.29 14.34 9.82 14.5A5.12 5.12 0 0 1 11.37 13.25A12.28 12.28 0 0 0 9 13M9 6.5A1.5 1.5 0 1 1 7.5 8A1.5 1.5 0 0 1 9 6.5M9 5A3 3 0 1 0 12 8A3 3 0 0 0 9 5M16.5 8.5A1 1 0 1 1 15.5 9.5A1 1 0 0 1 16.5 8.5M16.5 7A2.5 2.5 0 1 0 19 9.5A2.5 2.5 0 0 0 16.5 7Z" />
        </svg>
        <svg 
          style="width:40px;height:40px" 
          viewBox="0 0 24 24"
          class="text-white cursor-pointer"
          :class="{'text-red-400':!moduleShowConfig.hotel}"
          @click="moduleShowConfig.hotel = !moduleShowConfig.hotel"
        >
          <path fill="currentColor" d="M10,2V4.26L12,5.59V4H22V19H17V21H24V2H10M7.5,5L0,10V21H15V10L7.5,5M14,6V6.93L15.61,8H16V6H14M18,6V8H20V6H18M7.5,7.5L13,11V19H10V13H5V19H2V11L7.5,7.5M18,10V12H20V10H18M18,14V16H20V14H18Z" />
        </svg>
        <svg 
          style="width:40px;height:40px" 
          viewBox="0 0 24 24"
          class="text-white cursor-pointer"
          :class="{'text-red-400':!moduleShowConfig.flotila}"
          @click="moduleShowConfig.flotila = !moduleShowConfig.flotila"
        >
          <path fill="currentColor" d="M16,6L19,10H21C22.11,10 23,10.89 23,12V15H21A3,3 0 0,1 18,18A3,3 0 0,1 15,15H9A3,3 0 0,1 6,18A3,3 0 0,1 3,15H1V12C1,10.89 1.89,10 3,10L6,6H16M10.5,7.5H6.75L4.86,10H10.5V7.5M12,7.5V10H17.14L15.25,7.5H12M6,13.5A1.5,1.5 0 0,0 4.5,15A1.5,1.5 0 0,0 6,16.5A1.5,1.5 0 0,0 7.5,15A1.5,1.5 0 0,0 6,13.5M18,13.5A1.5,1.5 0 0,0 16.5,15A1.5,1.5 0 0,0 18,16.5A1.5,1.5 0 0,0 19.5,15A1.5,1.5 0 0,0 18,13.5Z" />
        </svg>
      </div>
      
      <div>
        <svg 
          style="width:40px;height:40px" 
          viewBox="0 0 24 24"
          class="text-white cursor-pointer"
          @click="saveTrip"
        >
          <title>Save trip</title>
          <path fill="currentColor" d="M15 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H17C18.1 21 19 20.1 19 19V7L15 3M17 19H3V5H14.2L17 7.8V19M10 12C8.3 12 7 13.3 7 15S8.3 18 10 18 13 16.7 13 15 11.7 12 10 12M4 6H13V10H4V6M23 13H21V7H23V13M23 17H21V15H23V17Z" />
        </svg>
      </div>
        
      <div class="flex flex-row gap-2">
        <div>
          <svg 
          style="width:40px;height:40px" 
          viewBox="0 0 24 24"
            class="text-white cursor-pointer"
            @click="exportTrip"
            >
            <title>Export trip</title>
            <path fill="currentColor" d="M9 12H18.8L16.3 9.5L17.7 8.1L22.6 13L17.7 17.9L16.3 16.5L18.8 14H9V12M21 17.4V20H3V6H21V8.6L23 10.6V4C23 2.9 22.1 2 21 2H3C1.9 2 1 2.9 1 4V20C1 21.1 1.9 22 3 22H21C22.1 22 23 21.1 23 20V15.4L21 17.4Z" />
          </svg>
          <input
          type="text"
          class="hidden text-black "
            :value="JSON.stringify(trip)"
            ref="exportelm"
          />
        </div>
      
        <div>
          <svg 
            style="width:40px;height:40px" 
            viewBox="0 0 24 24"
            class="text-white cursor-pointer"
            @click="importTrip()"
          >
            <title>Import trip</title>
            <path fill="currentColor" d="M19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H8L6 19H5V9H19V19H18L16 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M5 7V5H19V7H5M13 18V12H11V18H8L12 22L16 18H13Z" />
          </svg>
        </div>
      </div>

    </div>
  </div>

  <div class="flex flex-col md:flex-row gap-4">
    <members 
      v-if="moduleShowConfig.team" 
      class="w-40"
      @focus-member="memberName = $event"
    />
    <div class="flex flex-col gap-10">
      <hotel v-if="moduleShowConfig.hotel" :name="memberName"/> 
      <flotila v-if="moduleShowConfig.flotila" :name="memberName"/>
    </div>
  </div>

  <div class="font-mono hover:animate-pulse p-2 text-2xl text-white font-bold bg-gradient-to-r via-blue-500 from-cyan-500 to-purple-500">
    &copy; 2022 New IdeaX <span class="text-base">v.1.3</span>
  </div> 

</div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  /* text-indent: 1px;
  text-overflow: ''; */
  outline: none;
}
</style>
