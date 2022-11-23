import {axios} from '.';

export const getAll = async () => {
  const { data } = await axios.get('users');
  return data.items;
};

export const getById = async (id) => {
  const { data } = await axios.get(`users/${id}`);
  return data.items[0];
}

export const login = async (user, password) => {
  const { data } = await axios.post(`users/login`, {
    user: user,
    password: password
  });
  return data;
}

export const saveUser = async ({id, name, email, password, isAdmin}) => { 
  const {data} = await axios({
    method: id ? 'PUT' : 'POST',
    url: `users/${id ?? ''}`,
    data: {
      id,
      name,
      email,
      password,
      isAdmin
    }
  })
  return data.items;
};