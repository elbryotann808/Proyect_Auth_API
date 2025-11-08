import express from "express"
import cors from "cors"
import routesAuth from "./routers/auth.routes.js"
import swaggerDocument from "./docs/swagger.json" with {type: "json"}
import swaggerUi from "swagger-ui-express"

const app = express()

app.use(express.json())

app.use(cors())

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use("/api/auth", routesAuth)


export default app