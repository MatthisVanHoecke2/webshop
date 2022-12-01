import {axios} from '.';

export const countAll = async () => {
  const { data } = await axios.get('orders/count');
  return data.items[0];
}

export const getRecent = async () => {
  const { data } = await axios.get('orders/recent');
  return data.items;
}