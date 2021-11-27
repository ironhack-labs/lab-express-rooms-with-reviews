// imports
//populate data base
const mongoose = require('mongoose')
const Room = require('./../models/Room')

require('dotenv/config')
//Data
const rooms = [
    {
        "name": "Acapulco",
        "description": "Un lugar muy bonito donde esta Martin",
        "imageUrl":"https://i.ytimg.com/vi/QNpo-XRXH5g/hqdefault.jpg",
        "owner":"konhinclaro@gmail.com",
    },
    {
        "name": "Cancun",
        "description": "Hace calor pero si vas al extranjero es el primer lugar del que te comentan que han visitado en Mexico",
        "imageUrl":"https://images.adsttc.com/media/images/5b62/9201/f197/cc5a/c800/00b5/large_jpg/6._CASA_CANCUN._TERRAZA.jpg?1533186547",
        "owner":"konhinclaro@gmail.com",
    }
]


// Connect to db
mongoose.connect(process.env.MONGODB)

// Populate
const generateRooms = async() => {
    await Room.create(rooms)
    console.log('Data Base Populated')
    mongoose.connection.close()
}

// Invoke
generateRooms()