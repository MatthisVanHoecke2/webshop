import { axios } from '.';

export const getAll = async () => {
  const { data } = await axios.get('articles');
  return data.items;
};

export const getById = async (id) => {
  const { data } = await axios.get(`articles/${id}`);
  return data.items[0];
}

export const getAllPortraits = async () => {
  const { data } = await axios.get(`articles/portraits`);
  return data.items;
}

export const getPortaitByType = async (type) => {
  const { data } = await axios.get(`articles/portraits/${type}`);
  return data.items;
}