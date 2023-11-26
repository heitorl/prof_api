import { Request, Response } from "express";
import { addressService } from "../services";

class addressController {
  createAddress = async (req: Request, res: Response) => {
    try {
      const address = await addressService.createAddress(req);

      return res.status(201).json(address);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao atualizar o endereço." });
    }
  };
}

export default new addressController();
