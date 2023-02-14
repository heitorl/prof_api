
export const formatcepAddressUtil = ({ cep })  => {  
  
  const cepFormated = cep.replace("-", "")

  return cepFormated
}