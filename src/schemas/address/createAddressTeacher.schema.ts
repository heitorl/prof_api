import * as yup from "yup";

const createAddressSchema = yup.object().shape({
  street: yup.string().required(),
  number: yup.number().positive().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  cep: yup.string().required(),
});

const serializedCreateAddressSchema = yup.object().shape({
  id: yup.string().uuid().required(),
  street: yup.string().required(),
  number: yup.number().positive().required(),
  city: yup.string().required(),
  cep:  yup.string().required(),
  teacher: yup.object().notRequired().shape({    
    id: yup.string().uuid(),
    email: yup.string().email(),
    name: yup.string()
  }),
  student: yup.object().notRequired().shape({    
    id: yup.string().uuid(),
    email: yup.string().email(),
    name: yup.string()
  }),
});


export { createAddressSchema, serializedCreateAddressSchema }