import { serverHttp } from "./app";
import { AppDataSource } from "./data-source";
import "./websocket"

AppDataSource.initialize().then(
  () => {
    const port = process.env.RUN_PORT ?? 3000

    serverHttp.listen(port, () => {
      console.log(`App running on http://localhost:${port}/`)
    })
  }
).catch((err) => console.error(err))