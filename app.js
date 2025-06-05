const expr = require("express")
const { MongoClient, Admin, Collection, ObjectId } = require("mongodb")
const cors = require("cors")
const randomstring = require("randomstring")
const connection = new MongoClient("mongodb://imsbe:170205@localhost:27017/IMS?authSource=IMS")

const server = expr()
server.use(cors())
server.use(expr.json()); //converts incoming data to json

server.post("/users", async (req, res) => {  //api for sign-up
    if (req.body.name && req.body.email && req.body.password && req.body.phone) {

        await connection.connect()
        const db = connection.db("IMS")
        const collection = db.collection("USERS")
        const result = await collection.find({ "email": req.body.email }).toArray()

        if (result.length > 0) {
            res.json({ error: "User Already Exists" })
        }
        else {
            await collection.insertOne({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phone: Number(req.body.phone)
            })
            res.json({message: "User Created"})
        }
        connection.close()
    }
})

server.post("/token", async (req, res) => {

    if(req.body.email && req.body.password){

        await connection.connect()
        const db = connection.db("IMS")
        const collection = db.collection("USERS")
        const result = await collection.find({ "email": req.body.email, "password": req.body.password}).toArray()

        if(result.length > 0)
        {
            user = result[0]
            const generatedtoken = randomstring.generate(7)
            collection.updateOne({_id: user._id}, {$set: {token: generatedtoken}})
            res.status(200).json({token: generatedtoken})
        }
        else{
            res.status(401).json({error: "Wrong Credentials"})
        }
    }
    else{
        res.status(401).json({error: "Wrong Credentials"})
    }
})

server.get("/users/roles", async (req, res) => {

    if(req.headers.token){

        await connection.connect()
        const db = connection.db("IMS")
        const collection = db.collection("USERS")
        const result = await collection.find({ "token": req.headers.token}).toArray()

        if(result.length > 0)
        {
            user = result[0]
            res.status(200).json({
                admin: user.is_admin == true,
                player: !!user.playing_for,
                team_owner: !!user.team_id
            })
        }
        else{
            res.status(401).json({error: "Wrong Credentials"})
        }
    }
    else{
        res.status(401).json({error: "Wrong Credentials 2"})
    }
})

server.get("/players", async (req, res) => {

    await connection.connect()
    const db = await connection.db("IMS")
    const collection = await db.collection("USER")
    const result = await collection.find({ playing_for: { $exists: true } }).toArray()

    res.status(200).json(result)

    connection.close()
})

server.get("/teams", async (req, res) => {

    await connection.connect()
    const db = await connection.db("IMS")
    const collection = await db.collection("TEAM")
    const result = await collection.find().toArray()

    res.status(200).json(result)

    connection.close()
})

server.get("/players/:id/stats", async (req, res) => {

    console.log("stats req")

    if (req.params.id) {
        await connection.connect()
        const db = await connection.db("IMS")
        const collection = await db.collection("USER")
        const result = await collection.findOne({ "_id": new ObjectId(req.params.id)})
        res.status(200).json(result)

        connection.close()
    }

    else{
        res.status(400).json({ message: "Bad Request" })
    }

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