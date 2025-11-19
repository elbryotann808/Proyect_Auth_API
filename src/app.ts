import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"  
import swaggerDocument from "./docs/swagger.json" with { type: "json" }
// import ejs from "ejs"

import cookieParser from "cookie-parser"
import routesAuth from "./routers/auth.routes.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.set("view engine", "ejs")

app.get("/", (req, res)=>{
  res.render("index")
})

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use("/api/auth", routesAuth)

export default app