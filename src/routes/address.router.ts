import { Router } from "express";
import { addressController } from "../controllers";
import { validateSchema, validateToken } from "../middlewares";

import { createAddressSchema } from "../schemas";

const addressRouter = Router();

addressRouter.patch(
  "",
  validateToken,
  validateSchema(createAddressSchema),
  addressController.createAddress
);

export default addressRouter;
