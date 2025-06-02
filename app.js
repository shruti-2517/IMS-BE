const expr = require("express")

const server = expr()

server.post("/users", (req, res)=>{
    res.send("User is created")
})

server.post("/teams", (req, res)=>{
    res.send("Team is created")
})

server.post("/players", (req, res)=>{
    res.send("Player is created")
})

server.listen(8000, ()=>{
    console.log("Server is connected and listening on port 8000")
})