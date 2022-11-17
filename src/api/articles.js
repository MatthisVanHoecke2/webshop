import axios from 'axios';

const baseUrl = "http://localhost:9000/api/articles";

export const getAll = async () => {
  const { data } = await axios.get(baseUrl);
  return data.items;
};

export const getById = async (id) => {
  const { data } = await axios.get(`${baseUrl}/${id}`);
  return data.items[0];
}

export const getAllPortraits = async () => {
  const { data } = await axios.get(`${baseUrl}/portraits`);
  return data.items;
}

export const getPortaitByType = async (type) => {
  const { data } = await axios.get(`${baseUrl}/portraits/${type}`);
  return data.items;
}