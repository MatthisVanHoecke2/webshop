import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useConfirm } from "../contexts/DialogProvider";
import * as articlesApi from "../api/articles";
import dialogs from "../dialogs.json";
import { useSession } from "../contexts/AuthProvider";
import { calculatePrice } from "../components/GeneralMethods";

export default function Cart() {
  return (
    <>
    <div className="editpage cart">
      <div className="edit-header">
        <h1>Cart</h1>
      </div>
      <div className="d-flex">
        <div className="edit-content"><Table/></div>
      </div>
    </div>
    </>
  );
}

function Table() {
  const [articles, setArticles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [showDescription, setShowDescription] = useState(true);
  const { setShowConfirm, showConfirm, confirm, setConfirm, setMessage, subject, setSubject } = useConfirm();
  const { user } = useSession();

  const checkWindowSize = useCallback(() => {
    if(window.innerWidth < 992) setShowDescription(false);
    else setShowDescription(true);
  }, []);

  window.onresize = checkWindowSize;

  const deleteItem = useCallback((id) => {
    setShowConfirm(true);
    setMessage(dialogs.confirm.delete);
    setSubject('deleteitem');
    setDeleteIndex(id);
  }, [setShowConfirm, setMessage, setSubject]);

  const clearCart = useCallback(() => {
    setShowConfirm(true);
    setMessage(dialogs.confirm.cart.clear);
    setSubject('clearcart');
  }, [setShowConfirm, setMessage, setSubject]);

  useEffect(() => {
    if(confirm) {
      if(subject === 'deleteitem') {
        const array = [...orders];
        array.splice(deleteIndex, 1);
        setOrders(array);
        const cart = JSON.parse(localStorage.getItem('cart')) ?? [];
        const userCart = cart.find(el => el.user === user.id)
        if(userCart) userCart.cart = array;
        localStorage.setItem('cart', JSON.stringify(cart)); //set cart
      }
      else if(subject === 'clearcart') {
        setOrders([]); //clear variable
        const cart = JSON.parse(localStorage.getItem('cart')) ?? [];
        cart?.splice(cart.indexOf(el => el.user === user.id), 1);
        localStorage.setItem('cart', JSON.stringify(cart)); //set cart
      }
    }
    if(!showConfirm) setSubject('');
    setConfirm(false);
  }, [confirm, orders, setConfirm, deleteIndex, subject, setSubject, showConfirm, user]);

  useEffect(() => {
    const getData = async () => {
      const order = JSON.parse(localStorage.getItem('cart')).find(el => el.user === user.id)?.cart ?? [];
      setOrders(order);
      const article = await articlesApi.getAll();
      setArticles(article);
    }
    getData();
  }, [user]);

  return (
    <>
    {orders.length > 0 && <div className="table-container">
      <table className="table table-hover table-responsive">
        <thead>
          <tr>
            {showDescription && <th width="30%">Description</th>}
            <th width="25%">Reference</th>
            <th width="10%">Detailed</th>
            <th width="10%">Characters</th>
            <th width="10%">Price</th>
            <th width="15%">Type</th>
            <th width="10%">Delete</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((el, index) => (
            <TableItem data={{ index, ...el}} key={index} deleteItem={deleteItem} showDescription={showDescription} articles={articles}/>
          ))}
        </tbody>
      </table>
      <div style={{display: "flex", justifyContent: "space-between"}}><Button size="lg" variant="danger" onClick={clearCart}>Clear</Button><Button size="lg" variant="primary">Checkout</Button></div>
    </div>}
    {orders.length === 0 && <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "5rem", color: "gray"}}><label>Nothing to see here</label></div>}
    </>
  );
}

function TableItem({ data, deleteItem, showDescription, articles }) {
  const {index, characters, description, detailed, imageUrl, type} = data;
  const article = articles.find(art => art.type === type || art.name.toLowerCase() === type);
  const background = articles.find(art => art.name.toLowerCase() === "background");

  const [price, setPrice] = useState(article?.price);

  const calculate = useCallback(() => {
    setPrice(calculatePrice(article, background?.extra, data));
  }, [article, background, data]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <>
      <tr>
        {showDescription && <td style={{textAlign: "left"}}><textarea className="form-control" value={description} disabled={true}/></td>}
        <td><img className="img-fluid" src={imageUrl} alt=""></img></td>
        <td><input className="form-check-input" type="checkbox" checked={detailed} disabled={true}/></td>
        <td>{article?.name === background?.name ? '-' : (characters ?? 0)+1}</td>
        <td>{price}</td>
        <td>{article?.name}</td>
        <td><Button variant="secondary" onClick={() => deleteItem(index)}>Delete</Button></td>
      </tr>
    </>
  );
}