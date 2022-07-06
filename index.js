const prompt = require('prompt-sync')({sigint: true});

const ParkingLot = require('./parkingLot')

console.log('Welcome to the Parking app! Read guidelines before proceeding')
console.log('**************************GUIDELINES*************************')
console.log('Warning: exiting the app will clear the memory.')
console.log('Commands: type "exit" to exit')
console.log('Commands: type "e" to set entry point count')
console.log('Commands: type "v" to view')
console.log('Commands: type "s" to create slot location')
console.log('Commands: type "p" to park vehicle')
console.log('Commands: type "u" to unpark vehicle')

console.log('**************************END OF GUIDELINES*************************')

let Input = ''
let parkingArea = new ParkingLot()

while (Input !== 'exit') {
    Input = prompt('Enter Command: ')

    if(Input === 'v'){
        parkingArea.viewPark()        
    }

    if(Input === 'e'){
            let entry = prompt('Enter number of entry points: ')
            let entries = parseInt(entry)
        
            if(entries >= 3) {
                parkingArea.addEntry(entries)        
            } else {
                console.log('Number of entry point must be greater or equal to 3!')
            }
    }

    if(Input === 's') {
        parkingArea.mapSlotLocation()
    }

    if(Input === 'p') {
        let carName = prompt('Enter car name: ')
        let vehicleSize = parseInt(prompt('Enter vehicle size(1,2,3):  '))
        let entryPoint = parseInt(prompt('Enter entry point: '))

        if(
            vehicleSize && 
            (
                vehicleSize === 1 ||
                vehicleSize === 2 ||
                vehicleSize === 3 
            )
            && entryPoint
            ) {
            parkingArea.parkVehicle(carName, vehicleSize, entryPoint)
        } else {
            console.log('Must be a number. Check your input!')
        }
    }

    if(Input === 'u') {
        let carName = prompt('Enter car name to be unparked: ')
        
        parkingArea.unparkVehicle(carName)
    }

}
console.log('Exiting parking app. Thank you!')