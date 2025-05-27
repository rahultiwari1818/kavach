import app from "./app.js";

import db_config from "./config/db.config.js";

const PORT : number = Number(process.env.PORT);


app.listen(PORT,()=>{
    db_config();
    console.log(`Backend is Running on port ${PORT}.!`)
})