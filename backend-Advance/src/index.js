import dotenv from 'dotenv'
import connectDB from './db/index.js';
dotenv.config({
    path:'./.env'
});
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import { app } from './app.js';




connectDB()
.then(()=>{
    app.listen(process.env.PORT || 7000,()=>{
        console.log(`⚙️...Server is listing to Port : http://localhost:${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log('app Failed to load ',err)
})







// const app = express();
// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("error ",error)
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`app is listening on port${process.env.PORT}`)
//         })
        
//     } catch (error) {
//         console.error("ERROR : ",error)
//         throw error
//     }
// })()