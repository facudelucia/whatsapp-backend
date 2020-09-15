const {Schema, model} = require("mongoose");


const whatsappSchema = Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean
})

module.exports = model("messagecontents", whatsappSchema)