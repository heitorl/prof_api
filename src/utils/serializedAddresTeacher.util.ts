// interface ISerializedAddress {
//   id: string,
//   street: string,
//   number:
// }

export const serializedAddressTeacherUtil = async (teacher) => {
  const serializedTeacher = [];
  for (let i = 0; i < teacher.length; i++) {
    serializedTeacher.push({
      id: teacher[i].id,
      street: teacher[i].street,
      neighborhood: teacher[i].neighborhood,
      number: teacher[i].number,
      city: teacher[i].city,
      cep: teacher[i].cep,
      teacher: {
        id: teacher[i].teacher.id,
        name: teacher[i].teacher.name,
        email: teacher[i].teacher.email,
      },
      distanceValue: {
        value: teacher[i].distanceValue,
      },
    });
  }

  return serializedTeacher;
};

export const returnUserWithOutPassword = (dataUser: any) => {
  const { password, ...user } = dataUser;

  return user;
};
