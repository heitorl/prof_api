import express from "express"
import registerRouters from "./routes"
const cors = require('cors');

const app = express()

app.use(express.json())
app.use(cors())

registerRouters(app)

export default app