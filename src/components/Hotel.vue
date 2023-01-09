<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import Icon from './Icon.vue'
// import { mdiCloudOutline, mdiAccount } from '@mdi/js'

const props = defineProps(['name'])

const store = useStore()
const hotel = computed(() => store.state.trip.hotel)
const team = computed(() => store.state.trip.team)

const configHotel = ref({
    occupancy: false,
    gender: false,
    random: false,
})

const capacity = computed(() => {
    let _capacity = 0
    hotel.value.forEach( room => {
        _capacity += room.beds
    })
    
    return _capacity
})
const occupied = computed(() => {
    let _occupied = 0
    hotel.value.forEach( room => {
        _occupied += room.sleepers.filter(sleeper => sleeper).length
    })
    
    return _occupied
})

const addRoom = (index) => store.dispatch('addRoom', index)
const delRoom = (index) => store.dispatch('delRoom', index)
const cleanRoom = (index) => store.dispatch('cleanRoom', index)
const addBed = (index) => store.dispatch('addBed', index)
const delBed = (index) => store.dispatch('delBed', index)

function getSleeper(roomId, bedId) {
    return hotel.value[roomId].sleepers[bedId]
}

function cleanHotel() {
    if (confirm('Chcete uklidit vsechny pokoje?')) {
        hotel.value.forEach( (room,roomId) => {
            cleanRoom(roomId)
        })
    }
}

function allocateRandom() {
    if (confirm('ROZHODIT UCASTNIKY ZAJEZDU?')) {
        configHotel.value.gender = true

        console.clear()
        let _membersAllocated = []
        
        hotel.value.forEach( (room,roomId) => {
            cleanRoom(roomId)
        })

        hotel.value.every( (room,roomId) => {
            for (let bedId = 0; bedId < room.sleepers.length; bedId++) {
                let _randomMember = Math.floor(Math.random() * team.value.length)
                let _randomMemberName = team.value[_randomMember].name
                
                if (_membersAllocated.length >= team.value.length) {
                    // _membersAllocated = []
                    console.log('%cVsichni jsou ubytovani','color:red;')

                    return false
                }

                console.log('Start finding name ...')
                while (_membersAllocated.includes(_randomMemberName)) {
                    _randomMember = Math.floor(Math.random() * team.value.length)
                    _randomMemberName = team.value[_randomMember].name

                    // console.log('Random:', _randomMemberName)
                    // console.dir(_membersAllocated)
                }
                console.log('End finding name ...')
                
                _membersAllocated.push(_randomMemberName)

                // console.log('Ubytovany:',_membersAllocated.length, '>>', _randomMemberName)

                store.dispatch('setSleeper',{roomId,bedId,name: _randomMemberName})
                store.dispatch('allocateSleeper',{name: _randomMemberName, shouldAllocate: true})
                
                // console.log('Room:', roomId, '>', bedId, '>', hotel.value[roomId].sleepers[bedId])

            }
            
            return true
        })

        console.log('Konec ubytovani:', _membersAllocated.length)
    }
}

// function isSleeperAllocatedByName(name) {
//     hotel.value.forEach( room => {
//         if (room.sleepers.includes(name)) {
//             return true
//         }
//     })

//     return false
// }

// function setRandomAllocation() {
//     hotel.value.forEach( room => {
//         room.sleepers.forEach( sleeper => {
//             sleeper = store.trip.team[Math.random(36)].name 
//         })
//     })
    
// }

function toggleExtra(roomId, extraName) {
    store.dispatch('toggleExtra', {roomId, extraName})

    if (extraName === 'extrabed') {
        if (store.state.trip.hotel[roomId].extrabed) {
            addBed(roomId)
        } else {
            delBed(roomId)
        }
    }
}

function toggleConfig(configName) {
    configHotel.value[configName] = !configHotel.value[configName]
}

function setEmployeeInHotel(_memberId: number, _memberName: string, roomId: number, bedId: number) {
    const _sleeper = getSleeper(roomId, bedId)
    let _isEmployeeAllocated = false
    const _isBedAllocated = _sleeper ? true : false 

    if (_isBedAllocated) {
        console.log('Go out:', hotel.value[roomId].sleepers[bedId])
        store.dispatch('allocateSleeper',{name: hotel.value[roomId].sleepers[bedId], shouldAllocate: false})

        if (_sleeper === _memberName) {
            store.dispatch('setSleeper',{roomId,bedId,name:''})
            return
        }
    }

    hotel.value.forEach( room => {
        room.sleepers.forEach( sleeper => {
            if (sleeper === _memberName) {
                alert('Already allocated!')
                
                _isEmployeeAllocated = true
            }
        })
    })

    if (!_isEmployeeAllocated) {
        store.dispatch('setSleeper',{roomId,bedId,name:_memberName})
        store.dispatch('allocateSleeper',{name: _memberName, shouldAllocate: true})
    }
}

function clickEmployee(roomId: number, bedId: number) {
    if (props.name) {
        let _memberId 
        const _memberName = props.name

        team.value.forEach( (member, index) => {
            if (props.name === member.name) {
                _memberId = index
            }
        })

        console.log('Click Emp:', _memberName, '>', _memberId)

        setEmployeeInHotel(_memberId, _memberName, roomId, bedId)
    }
}

function dropEmployee(evt: any, roomId: number, bedId: number) {
    const _memberId = evt.dataTransfer.getData('memberId')
    const _memberName = evt.dataTransfer.getData('member')

    setEmployeeInHotel(_memberId, _memberName, roomId, bedId)

    // const _sleeper = getSleeper(roomId, bedId)
    // let _isEmployeeAllocated = false
    // const _isBedAllocated = _sleeper ? true : false 

    // if (_isBedAllocated) {
    //     console.log('Go out:', hotel.value[roomId].sleepers[bedId])
    //     store.dispatch('allocateSleeper',{name: hotel.value[roomId].sleepers[bedId], shouldAllocate: false})

    //     if (_sleeper === _memberName) {
    //         store.dispatch('setSleeper',{roomId,bedId,name:''})
    //         return
    //     }
    // }

    // hotel.value.forEach( room => {
    //     room.sleepers.forEach( sleeper => {
    //         if (sleeper === _memberName) {
    //             alert('Already allocated!')
                
    //             _isEmployeeAllocated = true
    //         }
    //     })
    // })

    // if (!_isEmployeeAllocated) {
    //     store.dispatch('setSleeper',{roomId,bedId,name:_memberName})
    //     store.dispatch('allocateSleeper',{name: _memberName, shouldAllocate: true})
    // }
}

onMounted(() => {
    console.log('Hotel started ...')
    // console.log('%cSTARTED:', 'color: white;background-color:red;font-size:14px;', new Date().toDateString())
    
})
</script>

<template>
<div class="flex flex-col">
    <div 
        class="flex flex-row justify-between items-center p-2 "
        :class="{'bg-red-500': occupied === capacity,'bg-violet-500': occupied < capacity}"
    >
        <div class="flex flex-row gap-2">
            <div class="ml-1 mt-1 flex flex-row gap-2 text-white font-bold">
                <icon 
                    name="bed-outline" 
                    tooltip="Pocet pokoju!"
                />
                <div class="">{{ hotel.length }}</div>
            </div>
            <div class="ml-1 mt-1 flex flex-row gap-2 text-white font-bold">
                <icon 
                    name="bunk-bed-outline" 
                    tooltip="Pocet posteli!"
                />
                <div class="">{{ capacity }}</div>
            </div>
            <div class="ml-1 mt-1 flex flex-row gap-2 text-white font-bold">
                <icon 
                    name="bed" 
                    tooltip="Pocet obsazenych posteli!"
                    color="text-blue-300"
                />
                <div class="">{{ occupied }}</div>
            </div>
        </div>
        <div class="flex flex-row gap-1">
            <icon 
                name="vacuum-outline" 
                tooltip="Smazat vsechny ubytovane!"
                @click="cleanHotel()"
            />
            <icon 
                name="human-queue" 
                tooltip="Ukazat volne postele!"
                :color="{'text-yellow-400':configHotel.occupancy}"
                @click="toggleConfig('occupancy')"
            />
            <icon 
                name="human-male-female" 
                tooltip="Ukazat ucastniky podle pohlavi!"
                :color="{'text-yellow-400':configHotel.gender}"
                @click="toggleConfig('gender')"
            />
            <icon 
                name="human-capacity-decrease" 
                tooltip="Ubytovat ucastniky nahodne!"
                :color="{'text-yellow-400':configHotel.random}"
                @click="allocateRandom()"
            />
        </div>
    </div>

    <div class="flex flex-col md:grid md:grid-cols-2">
        <div
            v-for="(room,roomId) in hotel" :key="roomId"
            class="mt-1 flex flex-col justify-between border-2 border-gray-300"
        >
                <div class="flex flex-row m-2">
                    <div
                        v-for="(bed,bedId) in room.beds" :key="bedId"
                        class="w-full m-1 self-end cursor-pointer bg-yellow-400 p-2 text-center font-bold text-white"
                        :class="{
                            'border-blue-200': room.extrabed && bedId === room.beds - 1,
                            'bg-violet-600': configHotel.occupancy && room.sleepers[bedId] === '',
                            'bg-pink-400': configHotel.gender && room.sleepers[bedId].split(' ')[0].includes('vá'),
                            'bg-blue-400': configHotel.gender && !room.sleepers[bedId].split(' ')[0].includes('vá') && room.sleepers[bedId].length > 0,
                            'w-20 h-6': room.sleepers[bedId] === '',
                            'text-red-500': room.sleepers[bedId] != '' && room.sleepers[bedId] === name,
                        }"
                        @dragover.prevent 
                        @drop="dropEmployee($event, roomId, bedId)"
                        @click="clickEmployee(roomId, bedId)"
                    >
                        {{room.sleepers[bedId]}}
                    </div>
                </div>
                
                <div class="px-2 h-8 flex flex-row justify-between bg-gray-400 text-white">
                    <input
                        v-model="room.comment"
                        :title="room.comment"
                        class="w-full font-normal focus:outline-none focus:bg-gray-500 bg-gray-400 text-sm"
                    />
                    <div class="pl-1 overflow-x-auto gap-2 flex flex-row  items-center">
                        <svg
                            style="width:24px;height:24px" 
                            viewBox="0 0 24 24"
                            class="cursor-pointer hover:text-blue-400"
                            @click="addRoom(roomId)"
                        >
                            <title>Pridat pokoj</title>
                            <path fill="currentColor" d="M12 11H10V9H12V11M14 11H16V9H14V11M13.4 21H12V17.5H10V21H4V3H18V13.1C18.3 13 18.7 13 19 13C19.3 13 19.7 13 20 13.1V1H2V23H14.5C14 22.4 13.6 21.7 13.4 21M14 7H16V5H14V7M16 13.8V13H14V15H14.5C15 14.5 15.5 14.1 16 13.8M8 5H6V7H8V5M8 9H6V11H8V9M6 19H8V17H6V19M12 5H10V7H12V5M10 15H12V13H10V15M8 13H6V15H8V13M18 15V18H15V20H18V23H20V20H23V18H20V15H18Z" />
                        </svg>
                        <svg 
                            v-if="hotel.length > 1"
                            style="width:24px;height:24px" 
                            viewBox="0 0 24 24"
                            class="cursor-pointer hover:text-red-400"
                            @click="delRoom(roomId)"
                        >
                            <title>Odebrat pokoj</title>
                            <path fill="currentColor" d="M12 11H10V9H12V11M14 11H16V9H14V11M13.4 21H12V17.5H10V21H4V3H18V13.1C18.3 13 18.7 13 19 13C19.3 13 19.7 13 20 13.1V1H2V23H14.5C14 22.4 13.6 21.7 13.4 21M14 7H16V5H14V7M16 13.8V13H14V15H14.5C15 14.5 15.5 14.1 16 13.8M8 5H6V7H8V5M8 9H6V11H8V9M6 19H8V17H6V19M12 5H10V7H12V5M10 15H12V13H10V15M8 13H6V15H8V13M15 18V20H23V18H15Z" />
                        </svg>
                        <svg 
                            v-if="room.beds < 6"
                            style="width:24px;height:24px" 
                            viewBox="0 0 24 24"
                            class="cursor-pointer hover:text-blue-400"
                            @click="addBed(roomId)"
                        >
                            <title>Pridat postel</title>
                            <path fill="currentColor" d="M15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4M15,5.9C16.16,5.9 17.1,6.84 17.1,8C17.1,9.16 16.16,10.1 15,10.1A2.1,2.1 0 0,1 12.9,8A2.1,2.1 0 0,1 15,5.9M4,7V10H1V12H4V15H6V12H9V10H6V7H4M15,13C12.33,13 7,14.33 7,17V20H23V17C23,14.33 17.67,13 15,13M15,14.9C17.97,14.9 21.1,16.36 21.1,17V18.1H8.9V17C8.9,16.36 12,14.9 15,14.9Z" />
                        </svg>
                        <svg
                            v-if="room.beds > 1" 
                            style="width:24px;height:24px" 
                            viewBox="0 0 24 24"
                            class="cursor-pointer hover:text-red-400"
                            @click="delBed(roomId)"
                        >
                            <title>Odebrat postel</title>
                            <path fill="currentColor" d="M15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4M15,5.9C16.16,5.9 17.1,6.84 17.1,8C17.1,9.16 16.16,10.1 15,10.1A2.1,2.1 0 0,1 12.9,8A2.1,2.1 0 0,1 15,5.9M1,10V12H9V10H1M15,13C12.33,13 7,14.33 7,17V20H23V17C23,14.33 17.67,13 15,13M15,14.9C17.97,14.9 21.1,16.36 21.1,17V18.1H8.9V17C8.9,16.36 12,14.9 15,14.9Z" />
                        </svg>
                        <svg
                            v-if="room.sleepers.some((sleeper) => sleeper !== '')" 
                            style="width:24px;height:24px" 
                            viewBox="0 0 24 24"
                            class="cursor-pointer hover:text-red-400"
                            @click="cleanRoom(roomId)"
                        >
                            <title>Smazat ubytovane</title>
                            <path fill="currentColor" d="M11 15.5H13V17.5H11V15.5M14 19C14 18.86 14 18.73 14 18.6H5.4L12 7.3L16.11 14.44C16.62 14 17.2 13.65 17.84 13.41L12 3.3L2 20.6H14.22C14.08 20.09 14 19.56 14 19M13 10.5H11V14.5H13V10.5M22.12 15.46L20 17.59L17.88 15.46L16.47 16.88L18.59 19L16.47 21.12L17.88 22.54L20 20.41L22.12 22.54L23.54 21.12L21.41 19L23.54 16.88L22.12 15.46Z" />
                        </svg>
                        <!-- <svg 
                            style="width:24px;height:24px" 
                            viewBox="0 0 24 24"
                            class="cursor-pointer"
                            :class="{'text-blue-600':room.extrabed}"
                            @click="toggleExtra(roomId, 'extrabed')"
                        >
                            <title>Pristylka</title>
                            <path fill="currentColor" d="M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z" />
                        </svg>
                        <svg 
                            style="width:24px;height:24px" 
                            viewBox="0 0 24 24"
                            class="cursor-pointer"
                            :class="{'text-blue-600':room.kitchen}"
                            @click="toggleExtra(roomId, 'kitchen')"
                        >
                            <title>Kuchynka</title>
                            <path fill="currentColor" d="M6,14H8L11,17H9L6,14M4,4H5V3A1,1 0 0,1 6,2H10A1,1 0 0,1 11,3V4H13V3A1,1 0 0,1 14,2H18A1,1 0 0,1 19,3V4H20A2,2 0 0,1 22,6V19A2,2 0 0,1 20,21V22H17V21H7V22H4V21A2,2 0 0,1 2,19V6A2,2 0 0,1 4,4M18,7A1,1 0 0,1 19,8A1,1 0 0,1 18,9A1,1 0 0,1 17,8A1,1 0 0,1 18,7M14,7A1,1 0 0,1 15,8A1,1 0 0,1 14,9A1,1 0 0,1 13,8A1,1 0 0,1 14,7M20,6H4V10H20V6M4,19H20V12H4V19M6,7A1,1 0 0,1 7,8A1,1 0 0,1 6,9A1,1 0 0,1 5,8A1,1 0 0,1 6,7M13,14H15L18,17H16L13,14Z" />
                        </svg>
                        <svg 
                            style="width:24px;height:24px" 
                            viewBox="0 0 24 24"
                            class="cursor-pointer"
                            :class="{'text-blue-600':room.familyroom}"
                            @click="toggleExtra(roomId, 'familyroom')"
                        >
                            <title>Rodinny pokoj</title>
                            <path fill="currentColor" d="M16 4C16 2.9 16.9 2 18 2S20 2.9 20 4 19.1 6 18 6 16 5.1 16 4M20 22V16H22.5L20 8.4C19.7 7.6 19 7 18.1 7H18C17.1 7 16.4 7.6 16.1 8.4L15.2 11C16.3 11.6 17 12.7 17 14.1V22.1H20M12.5 11.5C13.3 11.5 14 10.8 14 10S13.3 8.5 12.5 8.5 11 9.2 11 10 11.7 11.5 12.5 11.5M5.5 6C6.6 6 7.5 5.1 7.5 4S6.6 2 5.5 2 3.5 2.9 3.5 4 4.4 6 5.5 6M7.5 22V15H9V9C9 7.9 8.1 7 7 7H4C2.9 7 2 7.9 2 9V15H3.5V22H7.5M14 22V18H15V14C15 13.2 14.3 12.5 13.5 12.5H11.5C10.7 12.5 10 13.2 10 14V18H11V22H14Z" />
                        </svg>
                        <svg 
                            style="width:24px;height:24px" 
                            viewBox="0 0 24 24"
                            class="cursor-pointer"
                            :class="{'text-blue-600':room.bathroom}"
                            @click="toggleExtra(roomId, 'bathroom')"
                        >
                            <title>Koupelna</title>
                            <path fill="currentColor" d="M20,20A1,1 0 0,1 21,21A1,1 0 0,1 20,22A1,1 0 0,1 19,21A1,1 0 0,1 20,20M16,20A1,1 0 0,1 17,21A1,1 0 0,1 16,22A1,1 0 0,1 15,21A1,1 0 0,1 16,20M12,20A1,1 0 0,1 13,21A1,1 0 0,1 12,22A1,1 0 0,1 11,21A1,1 0 0,1 12,20M8,20A1,1 0 0,1 9,21A1,1 0 0,1 8,22A1,1 0 0,1 7,21A1,1 0 0,1 8,20M4,20A1,1 0 0,1 5,21A1,1 0 0,1 4,22A1,1 0 0,1 3,21A1,1 0 0,1 4,20M6,17A1,1 0 0,1 7,18A1,1 0 0,1 6,19H6A1,1 0 0,1 5,18A1,1 0 0,1 6,17H6M10,17A1,1 0 0,1 11,18A1,1 0 0,1 10,19A1,1 0 0,1 9,18A1,1 0 0,1 10,17M14,17A1,1 0 0,1 15,18A1,1 0 0,1 14,19A1,1 0 0,1 13,18A1,1 0 0,1 14,17M18,17A1,1 0 0,1 19,18A1,1 0 0,1 18,19A1,1 0 0,1 17,18A1,1 0 0,1 18,17M8,14A1,1 0 0,1 9,15A1,1 0 0,1 8,16A1,1 0 0,1 7,15A1,1 0 0,1 8,14M12,14A1,1 0 0,1 13,15A1,1 0 0,1 12,16A1,1 0 0,1 11,15A1,1 0 0,1 12,14M16,14A1,1 0 0,1 17,15A1,1 0 0,1 16,16A1,1 0 0,1 15,15A1,1 0 0,1 16,14M19,12H5V10H19V12M17.92,9H6.08C6.5,6.5 8.5,4.5 11,4.08V2H13V4.08C15.5,4.5 17.5,6.5 17.92,9Z" />
                        </svg> -->
                    </div>
                </div>
        </div>
    
    </div>
        
</div>
<!-- </div> -->
</template>
