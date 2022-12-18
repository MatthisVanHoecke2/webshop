import {axios} from '.';
import { formatDate } from '../components/GeneralMethods';

export const getAll = async () => {
  const { data } = await axios.get('orders');
  return data.items;
}

export const getByUserId = async (id) => {
  const { data } = await axios.get(`orders/user/${id}`);
  return data.items;
}

export const countAll = async () => {
  const { data } = await axios.get('orders/count');
  return data;
}

export const countCompleted = async () => {
  const { data } = await axios.get(`orders/count/completed`);
  return data;
}

export const countPending = async () => {
  const { data } = await axios.get(`orders/count/pending`);
  return data;
}

export const getRecent = async () => {
  const { data } = await axios.get('orders/recent');
  return data.items;
}

export const create = async ({orderData, orderlinesData}) => {
  const { data } = await axios.post('orders', {
    orderData,
    orderlinesData
  });
  data.items[0]["date"] = formatDate(new Date(data.items[0].date));
  return data.items[0];
}