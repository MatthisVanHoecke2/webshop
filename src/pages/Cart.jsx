import { useCallback } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { ORDERDATA } from "../api/mock-data";

export default function Cart() {
  return (
    <Table/>
  );
}

function TableItem({ data, deleteItem }) {
  const {id, description, imageUrl, detailed, extra, price, type} = data;
  return (
    <>
      <tr>
        <td><input className="form-check-input" type="checkbox"/></td>
        <td>{id}</td>
        <td style={{textAlign: "left"}}>{description}</td>
        <td><img src={imageUrl} alt=""></img></td>
        <td><input className="form-check-input" type="checkbox" defaultChecked={detailed}/></td>
        <td>{extra}</td>
        <td>{price}</td>
        <td>{type}</td>
        <td><Button variant="primary" onClick={() => deleteItem(id)}>Delete</Button></td>
      </tr>
    </>
  );
}

function Table() {
  const [orders, setOrders] = useState(ORDERDATA);

  const deleteItem = useCallback((id) => {
    const array = orders.filter(el => el.id !== id);
    setOrders(array);
  }, [orders]);

  return (
    <table className="table table-hover table-responsive">
      <thead>
        <tr>
          <th></th>
          <th width="7%">ID</th>
          <th width="27%">Description</th>
          <th width="16%">Reference</th>
          <th>Detailed</th>
          <th>Characters</th>
          <th>Price</th>
          <th>Type</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((el) => (
          <TableItem data={el} key={el.id} deleteItem={deleteItem}/>
        ))}
      </tbody>
    </table>
  );
}