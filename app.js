const expr = require("express")
const { mongoClient, MongoClient } = require('mongodb');
const cors = require("cors")
const connection = new MongoClient("mongodb://imsbe:170205@localhost:27017/IMS?authSource=IMS")

const server = expr()
server.use(cors())
server.use(expr.json()); //converts incoming data to json

server.post("/users", async (req, res) => {
    if (req.body.name && req.body.email && req.body.password && req.body.phone) {

        await connection.connect()
        const db = connection.db("IMS")
        const collection = db.collection("USERS")
        const result = await collection.find({ "email": req.body.email }).toArray()

        if (result.length > 0) {
            res.json({ error: "User Already Exists" })
        }
        else {
            collection.insertOne({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phone: Number(req.body.phone)
            })
            res.json({message: "User Created"})
        }
    }
})

server.get("/token", (req, res) => {
    connection.connect().
        then(() => connection.db("IMS")).
        then((db) => db.collection("USERS")).
        then((collection) => collection.find().toArray()).
        then((arr) => res.json(arr)).
        catch((err) => console.log(err))
})

server.post("/teams", (req, res) => {
    res.send("Team is created")
})

server.post("/players", (req, res) => {
    res.send("Player is created")
})

server.listen(8000, () => {
    console.log("Server is connected and listening on port 8000")
})


// connection string : "mongodb://imsbe:170205@localhost:27017/IMS?authSource=IMS"