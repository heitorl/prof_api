import * as yup from "yup";

const createAddressSchema = yup.object().shape({
  street: yup.string().required(),
  neighborhood: yup.string().required(),
  number: yup.number().positive().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  cep: yup.string().required(),
});

const serializedCreateAddressSchema = yup.object().shape({
  id: yup.string().uuid().required(),
  street: yup.string().required(),
  neighborhood: yup.string().required(),
  number: yup.number().positive().required(),
  city: yup.string().required(),
  cep: yup.string().required(),
});

export { createAddressSchema, serializedCreateAddressSchema };
