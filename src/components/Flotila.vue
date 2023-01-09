<script setup lang="ts">
import { unref, ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps(['name'])

const store = useStore()
const flotila = computed(() => store.state.trip.flotila)
const team = computed(() => store.state.trip.team)

const choosedMember = ref('Jan Novak')

const addCar = (carId) => store.dispatch('addCar', carId)
const delCar = (carId) => store.dispatch('delCar', carId)
const cleanCar = (carId) => store.dispatch('cleanCar', carId)

//FOR MOBILE VERSION
function chooseMember(name, carId, seatId) {
    console.log('Select member:', name)

    const _memberName = name

    const _seat = getSeat(carId, seatId)
    let _isEmployeeAllocated = false
    const _isSeatAllocated = _seat ? true : false 

    console.log('>>>>', _seat)
    console.log('>>>>', _isSeatAllocated)

    if (_isSeatAllocated) {
        console.log('Go out:', )
        store.dispatch('allocateSeat',{name: flotila.value[carId].seats[seatId], shouldAllocate: false})

        if (_seat === _memberName) {
            store.dispatch('setSeat',{carId,seatId,name:''})
            return
        }
    }

    flotila.value.forEach( car => {
        car.seats.forEach( seat => {
            if (seat === _memberName) {
                alert('Already allocated!')
                
                _isEmployeeAllocated = true
            }
        })
    })

    if (!_isEmployeeAllocated) {
        store.dispatch('setSeat',{carId, seatId, name:_memberName})
        store.dispatch('allocateSeat',{name: _memberName, shouldAllocate: true})
    }
}

function getSeat(carId, seatId) {
    return flotila.value[carId].seats[seatId]
}

function dropEmployeeToFlotila(evt: any, carId: number, seatId: number) {
    const _memberId = evt.dataTransfer.getData('memberId')
    const _memberName = evt.dataTransfer.getData('member')

    const _seat = getSeat(carId, seatId)
    let _isEmployeeAllocated = false
    const _isSeatAllocated = _seat ? true : false 

    if (_isSeatAllocated) {
        console.log('Go out:', )
        store.dispatch('allocateSeat',{name: flotila.value[carId].seats[seatId], shouldAllocate: false})

        if (_seat === _memberName) {
            store.dispatch('setSeat',{carId,seatId,name:''})
            return
        }
    }

    flotila.value.forEach( car => {
        car.seats.forEach( seat => {
            if (seat === _memberName) {
                alert('Already allocated!')
                
                _isEmployeeAllocated = true
            }
        })
    })

    if (!_isEmployeeAllocated) {
        store.dispatch('setSeat',{carId, seatId, name:_memberName})
        store.dispatch('allocateSeat',{name: _memberName, shouldAllocate: true})
    }
}

onMounted(() => {
    console.log('Flotila started ...')

    console.log(flotila.value[0])

    // store.state.trip.flotila[0].seats[0] = "John Driver"
})

</script>

<template>

<div class="flex flex-col md:flex-row md:flex-wrap gap-6">
    <div 
        v-for="(car, carId) in flotila" :key="carId"
        class="flex flex-col justify-between gap-4 border-2 border-gray-400"
    >

        <div class="flex flex-row gap-2">
            <div class="flex flex-col self-center gap-2">
                <div 
                    class="w-40 h-auto bg-green-300 p-2 text-center text-sm font-bold text-white"
                    :class="{
                        'bg-red-500': car.seats[0] != '' && car.seats[0] === name,
                        'h-10': car.seats[0] === '',
                    }"
                    @dragover.prevent 
                    @drop="dropEmployeeToFlotila($event, carId, 0)"
                >
                    <span class="">{{car.seats[0]}}</span>
                    <!-- <span class="invisible md:visible">{{car.seats[0]}}</span>
                    <span class="visible md:invisible">
                        <select 
                            :name="team + carId"
                            v-model="car.seats[0]"
                            class="w-36 h-8 bg-green-300 p-2 text-center text-sm font-bold text-white"
                            @change="chooseMember(car.seats[0], carId, 0)"
                        >
                                <option
                                    class=" bg-green-300 p-2 text-center text-sm font-bold text-white"
                                    v-for="(memberSelect,index) in team" :key="index"
                                    :value="memberSelect.name"
                                    :selected="memberSelect.name === car.seats[0] ? true : false"
                                >
                                    {{ memberSelect.name }}
                                </option>
                        </select>
                    </span> -->
                </div>
                <div 
                    class="w-40 h-auto bg-red-400 p-2 text-center text-sm font-bold text-white"
                    :class="{'bg-red-500': car.seats[1] != '' && car.seats[1] === name}"
                    @dragover.prevent 
                    @drop="dropEmployeeToFlotila($event, carId, 1)"
                >
                    <span class="">{{car.seats[1]}}</span>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <div 
                    class="w-40 h-auto bg-green-300 p-2 text-center text-sm font-bold text-white"
                    :class="{'bg-red-500': car.seats[2] != '' && car.seats[2] === name}"
                    @dragover.prevent 
                    @drop="dropEmployeeToFlotila($event, carId, 2)"
                >
                    {{car.seats[2]}}
                </div>
                <div 
                    class="w-40 h-auto bg-green-300 p-2 text-center text-sm font-bold text-white"
                    :class="{'bg-red-500': car.seats[3] != '' && car.seats[3] === name}"
                    @dragover.prevent 
                    @drop="dropEmployeeToFlotila($event, carId, 3)"
                >
                    {{car.seats[3]}}
                </div>
                <div 
                    class="w-40 h-auto bg-green-300 p-2 text-center text-sm font-bold text-white"
                    :class="{'bg-red-500': car.seats[4] != '' && car.seats[3] === name}"
                    @dragover.prevent 
                    @drop="dropEmployeeToFlotila($event, carId, 4)"
                >
                    {{car.seats[4]}}
                </div>
            </div>
            <!-- <div class="flex flex-col gap-2">
                <div 
                    v-for="i in 3" :key="i" 
                    class="w-40 h-10 bg-green-300 p-2 text-center font-bold text-white">
                        {{car.seats[i+1]}}
                </div>
            </div> -->
        </div>

        <div class="p-2 gap-1 flex flex-row justify-between bg-gray-400 text-white">
            <!-- <div class="self-center text-white font-bold">{{car.comment}}</div> -->
                <!-- class="self-center text-red font-bold" -->
            <input
                class="text-white font-bold outline-none bg-gray-400 focus:bg-gray-300"
                v-model="car.comment"
            />
            <div class="p-2 gap-1 flex flex-row bg-gray-400 text-white">
                <svg 
                    v-if="flotila.length < 10"
                    style="width:24px;height:24px" 
                    viewBox="0 0 24 24"
                    class="cursor-pointer text-white hover:text-blue-400"
                    @click="addCar(carId)"
                >
                    <path fill="currentColor" d="M18.9 6C18.7 5.4 18.1 5 17.5 5H6.5C5.8 5 5.3 5.4 5.1 6L3 12V20C3 20.5 3.5 21 4 21H5C5.6 21 6 20.5 6 20V19H18V20C18 20.5 18.5 21 19 21H20C20.5 21 21 20.5 21 20V12L18.9 6M6.8 7H17.1L18.2 10H5.8L6.8 7M19 17H5V12H19V17M7.5 13C8.3 13 9 13.7 9 14.5S8.3 16 7.5 16 6 15.3 6 14.5 6.7 13 7.5 13M16.5 13C17.3 13 18 13.7 18 14.5S17.3 16 16.5 16C15.7 16 15 15.3 15 14.5S15.7 13 16.5 13Z" />
                </svg>
                <svg 
                    v-if="flotila.length > 1"
                    style="width:24px;height:24px" 
                    viewBox="0 0 24 24"
                    class="cursor-pointer text-white hover:text-blue-400"
                    @click="delCar(carId)"
                >
                    <path fill="currentColor" d="M20.5,19.85L6.41,5.76L2.41,1.76L1.11,3L4.57,6.46L3,11V19A1,1 0 0,0 4,20H5A1,1 0 0,0 6,19V18H16.11L20.84,22.73L22.11,21.46L20.5,19.85M6.5,15A1.5,1.5 0 0,1 5,13.5A1.5,1.5 0 0,1 6.5,12A1.5,1.5 0 0,1 8,13.5A1.5,1.5 0 0,1 6.5,15M5,10L5.78,7.67L8.11,10H5M17.5,5.5L19,10H13.2L16.12,12.92C16.5,12.17 17.37,11.86 18.12,12.21C18.87,12.57 19.18,13.47 18.83,14.21C18.68,14.5 18.43,14.77 18.12,14.92L21,17.8V11L18.92,5C18.71,4.4 18.14,4 17.5,4H7.2L8.7,5.5H17.5Z" />
                </svg>
                <svg 
                    style="width:24px;height:24px" 
                    viewBox="0 0 24 24"
                    class="cursor-pointer text-white hover:text-blue-400"
                    @click="cleanCar(carId)"
                >
                    <path fill="currentColor" d="M3,16.74L7.76,12L3,7.26L7.26,3L12,7.76L16.74,3L21,7.26L16.24,12L21,16.74L16.74,21L12,16.24L7.26,21L3,16.74M12,13.41L16.74,18.16L18.16,16.74L13.41,12L18.16,7.26L16.74,5.84L12,10.59L7.26,5.84L5.84,7.26L10.59,12L5.84,16.74L7.26,18.16L12,13.41Z" />
                </svg>
            </div>
        </div>

    </div>
</div>
</template>

