import { createStore, storeKey } from 'vuex'

const state = {}

// const state = {
//     trip: JSON.parse(window.localStorage.getItem('trip') || '{}')
// }

const mutations = {
    addMember (state, name) {
        state.trip.team.push({
            name: name,
            isInHotel: false,
            room: 0,		
            bed: 0,		
            isInFlotila: false,		
            car: 0,		
            seat: 0,
        })
    },
    delMember (state, name) {
        
        let _memberId = -1
        
        state.trip.team.forEach( (member, index) => {
            if (member.name === name) {
                _memberId = index
            }
        })
        
        state.trip.hotel.forEach( room => {
            if (room.sleepers.indexOf(name) !== -1) {
                room.sleepers[room.sleepers.indexOf(name)] = ''
                return
            }
        })
      
        state.trip.flotila.forEach( car => {
            if (car.seats.indexOf(name) !== -1) {
                car.seats[car.seats.indexOf(name)] = ''
                return
            }
        })
        
        console.log('Index:', _memberId)

        state.trip.team.splice(_memberId, 1)

    },
    addRoom (state, index) {
        const _room = {
            sleepers: ['',''],
            beds: 2,
            comment: 'Hotelovy pokoj'
        }
        state.trip.hotel.splice(index + 1, 0, _room)
    },
    delRoom (state, index) {
        state.trip.hotel.splice(index, 1)
    },
    cleanRoom (state, index) {
        state.trip.hotel[index].sleepers = []
        state.trip.hotel[index].sleepers.length = state.trip.hotel[index].beds
        state.trip.hotel[index].sleepers.fill('')
    },
    addBed (state, index) {
        state.trip.hotel[index].beds ++
        state.trip.hotel[index].sleepers.push('')
    },
    delBed (state, index) {
        state.trip.hotel[index].beds --
        state.trip.hotel[index].sleepers.splice(state.trip.hotel[index].sleepers.length-1,1)
    },
    toggleExtra(state, {roomId, extraName}) {
        state.trip.hotel[roomId][extraName] = !state.trip.hotel[roomId][extraName]
    },
    setSleeper(state, {roomId, bedId, name}) {
        state.trip.hotel[roomId].sleepers[bedId] = name
    },
    allocateSleeper (state, {memberId, shouldAllocate}) {
        state.trip.team[memberId].isInHotel = shouldAllocate
    },
    updateAllocationsHotel (state) {
        let _sleepers = []
        state.trip.hotel.forEach( (room,i) => {
            room.sleepers.forEach( (sleeper,ii) => {
                if (sleeper) _sleepers.push(sleeper)        
            })
        })

        state.trip.team.forEach( (member,index) => {
            state.trip.team[index].isInHotel = false
            if (_sleepers.includes(member.name)) {
                state.trip.team[index].isInHotel = true
            }
        })
    },
    addCar (state, carId) {
        const _car = {
            seats: ['','','','',''],
            color: 'blue',
            comment: 'Dacia Duster'
        }
        state.trip.flotila.splice(carId + 1, 0, _car)
    },
    delCar (state, carId) {
        state.trip.flotila.splice(carId, 1)
    },
    cleanCar (state, carId) {
        state.trip.flotila[carId].seats = []
    },
    setSeat(state, {carId, seatId, name}) {
        console.log(carId, seatId, name)
        state.trip.flotila[carId].seats[seatId] = name
    },
    allocateSeat (state, {memberId, shouldAllocate}) {
        state.trip.team[memberId].isInFlotila = shouldAllocate
    },
    updateAllocationsFlotila (state) {
        let _seats = []
        state.trip.flotila.forEach( (car,i) => {
            car.seats.forEach( (seat,ii) => {
                if (seat) _seat.push(seat)        
            })
        })

        state.trip.team.forEach( (member,index) => {
            state.trip.team[index].isInFlotila = false
            if (_seats.includes(member.name)) {
                state.trip.team[index].isInFlotila = true
            }
        })
    },
    setTrip (state, trip) {
        state.trip = {...trip}
    },
    startTrip(state) {
        state = {
            trip: JSON.parse(window.localStorage.getItem('trip') || '{}')
        }
    }
}

const actions = {
    addMember ({ commit }, name) {
        commit('addMember', name)
    },
    delMember ({ commit }, name) {
        commit('delMember', name)
    },
    addRoom ({ commit }, index) {
        commit('addRoom', index)
    },
    delRoom ({ commit }, index) {
        commit('delRoom', index)
        commit('updateAllocationsHotel')
    },
    cleanRoom ({ commit }, index) {
        commit('cleanRoom', index)
        commit('updateAllocationsHotel')
    },
    addBed ({ commit }, index) {
        commit('addBed', index)
    },
    delBed ({ commit }, index) {
        commit('delBed', index)
        commit('updateAllocationsHotel')
    },
    toggleExtra ({ commit }, {roomId, extraName}) {
        commit('toggleExtra', {roomId, extraName})
    },
    setSleeper ({ commit }, {roomId, bedId, name}) {
        commit('setSleeper', {roomId, bedId, name})
    },
    allocateSleeper ({ state, commit }, {name, shouldAllocate}) {
        let memberId = -1
  
        state.trip.team.forEach( (member, index) => {
            if (member.name === name) {
                memberId = index
                return
            }
        })

        commit('allocateSleeper', {memberId, shouldAllocate})
    },
    getSleeperName ({ state }, {roomId, bedId}) {
        console.log('Sleeper:', state.trip.hotel[roomId].sleepers[bedId])
        return state.trip.hotel[roomId].sleepers[bedId]
    },
    addCar ({ commit }, carId) {
        commit('addCar', carId)
    },
    delCar ({ commit }, carId) {
        commit('delCar', carId)
        commit('updateAllocationsFlotila')
    },
    cleanCar ({ commit }, carId) {
        commit('cleanCar', carId)
        commit('updateAllocationsFlotila')
    },
    setSeat ({ commit }, {carId, seatId, name}) {
        console.log(carId, seatId, name)
        commit('setSeat', {carId, seatId, name})
    },
    allocateSeat ({ state, commit }, {name, shouldAllocate}) {
        let memberId = -1
  
        state.trip.team.forEach( (member, index) => {
            if (member.name === name) {
                memberId = index
                return
            }
        })

        commit('allocateSeat', {memberId, shouldAllocate})
    },
    setTrip ({ state, commit }, trip) {
        commit('setTrip', trip)
    },
    startTrip(commit) {
        commit('startTrip')
    }
}

export default createStore({
    state,
    actions,
    mutations
})
  