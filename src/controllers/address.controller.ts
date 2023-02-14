import { Request, Response } from "express";
import { addressService } from "../servcices";


class addressController {  

  createAddress = async (req: Request, res: Response) => {
    const address = await addressService.createAddress(req)

    return res.status(201).json(address)
  }

}

export default new addressController()
