//import
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Messages = require("./dbMessages")
const Pusher = require('pusher');
//app config
const app = express()
const port = process.env.PORT || 9000
//middleware
app.use(express.json())
app.use(cors())
/* app.use((req,res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")
    next()
}) */
//db config
//JF6ePSJHUz3ioOuo
const connection_url = "mongodb+srv://admin:JF6ePSJHUz3ioOuo@cluster0.nuytq.mongodb.net/<dbname>?retryWrites=true&w=majority"
mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const db = mongoose.connection
db.once("open", ()=>{
    console.log("db connected")

    const msgCollection = db.collection("messagecontents")
    const changeStream = msgCollection.watch()

    changeStream.on("change",(change)=>{
        console.log(change)
        if(change.operationType === "insert"){
            const messageDetails = change.fullDocument
            pusher.trigger("messages", "inserted",{
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        }else{
            console.log("error triggering pusher")
        }
    })
})
const pusher = new Pusher({
    appId: '1072975',
    key: '03d96052c2f18ad97a18',
    secret: '3c3256d515eeaf88e669',
    cluster: 'us2',
    encrypted: true
  });


//??

//api routes
app.get("/", (req,res)=>res.status(200).send("hola mundo"))
app.get("/messages/sync", (req,res)=>{
    Messages.find((err, data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})
app.post("/messages/new", (req,res)=>{
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

//listen
app.listen(port, ()=>console.log(`app is running on ${port}`))