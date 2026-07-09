import express from "express"
import dotenv from "dotenv"

dotenv.config()
const app = express()

const port = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.send('sever is ready');
    
})

app.get("/api/jokes",(req,res)=>{
    const jokes = [
        {
            id:1,
            tittle:"joke1",
            joke:"this is the joke 1 "
        },
        {
            id:2,
            tittle:"joke2",
            joke:"this is the joke 2 "
        },
        {
            id:3,
            tittle:"joke3",
            joke:"this is the joke 3 "
        },
        {
            id:4,
            tittle:"joke4",
            joke:"this is the joke 4 "
        },
        {
            id:5,
            tittle:"joke5",
            joke:"this is the joke 5 "
        },
    ]
    res.send(jokes)
})


app.listen(port,()=>{
    console.log(`server at http://localhost:${port}`);
    
})