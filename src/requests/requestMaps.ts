import axios from "axios";
import * as env from "dotenv"

env.config()

const requestDistanceMaps = async (origin: string, destination: string) => {
  let res = await axios.get(
    `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${process.env.API_KEY_MAPS}`
    );  

  return res.data
}

export { requestDistanceMaps }

