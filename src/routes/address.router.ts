import { Router } from "express";
import { addressController } from "../controllers";
import { validateSchema, validateToken, verifyAddressAlreadyExists } from "../middlewares";

import { createAddressSchema } from "../schemas";

const addressRouter = Router();

addressRouter.post(
  "",
  validateToken,
  verifyAddressAlreadyExists,
  validateSchema(createAddressSchema), 
  addressController.createAddress
);


export default addressRouter;