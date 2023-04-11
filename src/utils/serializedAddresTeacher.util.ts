// interface ISerializedAddress {
//   id: string,
//   street: string,
//   number:
// }

export const serializedAddressTeacherUtil = async (address: any) => {
  const serializedTeacher = []
  for(let i = 0; i < address.length; i++){
    console.log(address[i])
    serializedTeacher.push({
      id: address[i].id,
      street: address[i].street,
      number: address[i].number,
      city: address[i].city,
      cep:  address[i].cep,
      teacher: {
        id: address[i].teacher.id,
        name: address[i].teacher.name,
        email: address[i].teacher.email
      },
      distanceValue: { 
        value: address[i].distanceValue
      },
    })
  }
  
  return serializedTeacher

}


export const returnUserWithOutPassword = (dataUser: any) => {

  const {password, ...user} = dataUser

  return user
}