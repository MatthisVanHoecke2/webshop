import {axios} from '.';

export const getAll = async () => {
  const { data } = await axios.get('orderlines');
  return data.items;
}

export const getById = async (id) => {
  const { data } = await axios.get(`orderlines/${id}`);
  return data.items[0];
}

export const getByOrderId = async (id) => {
  const { data } = await axios.get(`orderlines/order/${id}`);
  return data.items;
}

export const saveOrderline = async ({ id, order, article, status, price, character, imageUrl, detailed }) => { 
  const {data} = await axios({
    method: id ? 'PUT' : 'POST',
    url: `orderlines/${id ?? ''}`,
    data: {
      id,
      order,
      article,
      status,
      price,
      character,
      imageUrl,
      detailed
    }
  })
  return data;
};