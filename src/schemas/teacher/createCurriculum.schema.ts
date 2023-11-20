import * as yup from "yup";

const createCurriculumSchema = yup
  .object()
  .shape({
    formation: yup.array().of(
      yup.object().shape({
        academicDegree: yup.string().required(),
        studyArea: yup.string().required(),
        institution: yup.string().required(),
      })
    ),
    professional_experience: yup.array().of(
      yup.object().shape({
        position: yup.string().required(),
        company: yup.string().required(),
        startDate: yup.date().required(),
        endDate: yup.date().nullable(),
      })
    ),
    celullar: yup.string(),
  })
  .nullable();
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

export { createCurriculumSchema, serializedCreateCurriculumSchema };
