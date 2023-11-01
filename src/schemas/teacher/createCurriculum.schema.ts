import * as yup from "yup"

const createCurriculumSchema = yup.object().shape({
  disciplines: yup.array().of(yup.string()).required(),
  cpf: yup.string().required(),
  formation: yup.string().nullable(),
  skills: yup.string().nullable(),
  professional_experience: yup.string(),
  linkedin: yup.string().nullable(),
  celullar: yup.string().nullable(),
  resume: yup.string().nullable(),
  
});

const serializedCreateCurriculumSchema = yup.object().shape({
  disciplines: yup.array().of(yup.string()).required(),
  cpf: yup.string().required(),
  formation: yup.string().nullable(),
  skills: yup.string().nullable(),
  professional_experience: yup.string().nullable(),
  linkedin: yup.string().nullable(),
  celullar: yup.string().nullable(),
  resume: yup.string().nullable(),

});


export { createCurriculumSchema, serializedCreateCurriculumSchema }