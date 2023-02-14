import * as yup from "yup"

const createStudentSchema = yup.object().shape({
  name: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().lowercase().required(),
  password: yup.string().required(),
});

const serializedCreateStudentSchema = yup.object().shape({
  id: yup.string().uuid().required(),
  email: yup.string().email().required(),
  name: yup.string().required(),
  lastName: yup.string().required(),

});


export { createStudentSchema, serializedCreateStudentSchema }