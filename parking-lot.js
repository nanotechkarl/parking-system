const prompt = require('prompt-sync')({sigint: true});

class ParkingLot {
    constructor() {
        this.entries = 0
        this.nextSlotCounter = 1
        this.slots = []
        this.hadLeft = []
    }

    viewPark() {
        if(this.entries < 3) {
            console.log(`Minimum of 3 entry points!`)
        } else {
            console.log(JSON.stringify(this))
        }
    }

    addEntry(count) {
        this.entries = count
        console.log('Successfuly added entries point count')
    }

    mapSlotLocation() {
        let counter = 0
        let slotLocation = []
        let size = null
        let enterSizeInteger = null
    
        while (this.entries !== counter ) {
            if(!size) {
                let enterSize = prompt(`Size Configuration of the Slot: 1 for small, 2 for medium, 3 for large: `)
                enterSizeInteger = parseInt(enterSize)
            }
            
            if(
                enterSizeInteger &&
                (
                    enterSizeInteger === 1  
                    || enterSizeInteger === 2
                    || enterSizeInteger === 3
                )
            ) {
                size = enterSizeInteger

                let slotLocationPrompt = prompt(`Add distance to entry ${counter + 1}: `)
                let slotPromptInteger = parseInt(slotLocationPrompt)
                
                if(slotPromptInteger) {
                    slotLocation.push(slotLocationPrompt)
                    counter++
                } else {
                    console.log('enter again')
                }

            } else {
                console.log('enter again')
            }            
        }


        let slot = {
            index: this.nextSlotCounter,
            occupiedBy: {},
            size,
            location: slotLocation
        }
        let isDuplicate = false
        
        if(slotLocation.length){
            isDuplicate = this.isDuplicateSlotLocation(slotLocation)
        }
        
        if(isDuplicate){
            console.log('Duplicate slot. Please try again again')
        } else {
            this.slots.push(slot)
            this.nextSlotCounter++
        }
        
    }

    isDuplicateSlotLocation(location) {
        let duplicate = false
        this.slots.map((obj)=>{
            if(JSON.stringify(obj.location) === JSON.stringify(location)) {
                duplicate = true
            }
        })

        return duplicate
    }

    parkVehicle(name, vehicleSize, entryPoint) {
        let populateOne = false
        let dateCurrent = new Date(Date.now())
        let hoursContinue = Infinity

        if(this.hadLeft.length > 0) {
            const userHadLeft = this.hadLeft.find((obj)=> {
                return obj.name == name
            })
            if(userHadLeft){
                hoursContinue = this.diffHoursNotRounded(new Date(Date.now()), userHadLeft.dateLeft) //diff of date left and date.now manipulate here
                console.log('If less than one hour, proceeding to continue your previous stay :', hoursContinue); //if less than 1 hour update Occupied date by its last date occupied
            }

            if(hoursContinue < 1) {
                dateCurrent = userHadLeft.lastDateOccupied
            } 

            //remove vehicle on hadLeft
            this.hadLeft = this.hadLeft.filter((obj) => { 
                return obj.name != name 
            }); 
        }

        if(entryPoint <= this.entries && entryPoint > 0) {
            const userExist = this.slots.find((obj)=> {
                return obj.occupiedBy.name == name
            })

            if(!userExist){
                this.slots.sort((a,b)=>{
                    return a.location[parseInt(entryPoint)-1]-b.location[parseInt(entryPoint)-1]
                })

                this.slots.map((obj)=>{
                    if(obj.size >= vehicleSize) {
                        if (!Object.keys(obj.occupiedBy).length && !populateOne) {
                            obj.occupiedBy = {
                                name, 
                                vehicleSize,
                                entryPoint,
                                date: dateCurrent
                            }
                            populateOne = true

                            console.log('Parked Successfully')
                        }
                    }
                })
            } else {
                console.log('User already exist. try another name.')
            }
      
        }
    }

    unparkVehicle(name) {
        this.slots.map((obj)=>{
            if(obj.occupiedBy.name === name) {
                const {hours, leavingDate} = this.billsPayment(obj.occupiedBy.date, obj.size)
                this.hadLeft.push({
                    name,
                    hours,
                    dateLeft: leavingDate,
                    lastDateOccupied: obj.occupiedBy.date
                })
                obj.occupiedBy = {}
            }
        })
    }

    billsPayment(date, size) {
        const leavingDate = new Date(Date.now()) //add plus for value demo  ex + (28hours)*60*60*1000
        let hours = this.diffHoursRounded(leavingDate, date) 
        let payment = 0
        let rate = 0
        if(size == 1) {
            rate = 20
        } else if(size == 2) {
            rate = 60
        } else if(size == 3) {
            rate = 100
        }


        if(hours <= 3) {
            payment = 40 
        } else if(hours >= 24) {
            payment = 5000
  
            if(hours > 24) { //rate will not add 40 flat rate after 24 hours
                payment = 5000 + (hours)*rate
            }
        } else if(hours > 3 && hours < 24) {

            payment = 40 + (hours-3)*rate

        }
        

        console.log(`Total Stay: ${payment} Pesos, Total Hours: ${hours}`)
        return {
            hours, 
            leavingDate
        }
    }


    diffHoursRounded(dt2, dt1) {
        let diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        
        return Math.abs(Math.ceil(diff));
    }

    diffHoursNotRounded(dt2, dt1){
        let diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        
        return Math.abs(diff);
    }
}

module.exports = ParkingLot