import axios from "axios"
import './App.css'
import { useState } from "react"
import { useEffect } from "react"

function App() {
  const [jokes, setJokes]=useState([])
  useEffect(()=>{
   axios.get('/api/jokes')
   .then((Response)=>{
    setJokes(Response.data)
    console.log(jokes)
   })
   .catch((err)=>{
    console.error();
    
   })
  },[])
 

  return (
   <>
   <div>

   <h1>hello brother's joke</h1>
   <p>joke:{jokes.length}</p>
   {
    jokes.map((j,index)=>(
      <div key={j.id}>
      <h2>{j.tittle}</h2>
      <p>{j.joke}</p>
      </div>
    ))
      }
      </div>
   </>
  )
}

export default App
