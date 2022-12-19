import { useEffect } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import * as articlesApi from "../api/articles";
import { calculatePrice, getErrorMessage } from "../components/GeneralMethods";
import { useSession } from "../contexts/AuthProvider";
import { useMessage } from "../contexts/DialogProvider";
import dialogs from "../dialogs.json";
import * as ordersApi from "../api/orders";

export default function Checkout() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const { user } = useSession();
  const navigate = useNavigate();
  const { setMessage, setShowMessage, setMessageTitle } = useMessage();

  useEffect(() => {
    const getData = async () => {
      const order = JSON.parse(localStorage.getItem('cart')).find(el => el.user === user.id)?.cart ?? undefined;
      if(!order) {
        navigate('/');
        setMessage(dialogs.error.checkout.noitems);
        setMessageTitle('Error');
        setShowMessage(true);
      }
      else {
        const articlesA = await articlesApi.getAll().catch((err) => {
          const error = getErrorMessage(err);
          setMessageTitle('Error');
          setMessage(error.message);
          setShowMessage(true);
        });

        let totalPrice = 0;
        order.forEach(ord => {
          const article = articlesA.find(el => el.type === ord.type || el.type?.toLowerCase() === ord.name?.toLowerCase());
          const detailPrice = articlesA.find(el => el.name.toLowerCase() === 'background')?.extra;
          const { characters, detailed } = ord;
          ord["name"] = article.name;
          ord["article"] = article.id;
          ord["price"] = calculatePrice(article, detailPrice, { characters, detailed });
          ord["detailed"] = detailed ? 1 : 0;
          totalPrice += ord["price"];
        })
        setOrders(order);
        setTotal(totalPrice);
      }
    }
    getData();
  }, [user, navigate, setMessage, setShowMessage, setMessageTitle]);

  const handleClick = async () => {
    await ordersApi.create({orderData: {user: user.id, price: total}, orderlinesData: orders}).then(() => {
      setMessageTitle('Info');
      setMessage(dialogs.info.checkout.payed);
      setShowMessage(true);
    }).catch((err) => {
      const error = getErrorMessage(err);
      setMessageTitle('Error');
      setMessage(error.message);
      setShowMessage(true);
    })

    setOrders([]); //clear variable
    const cart = JSON.parse(localStorage.getItem('cart')) ?? [];
    cart?.splice(cart.indexOf(el => el.user === user.id), 1);
    localStorage.setItem('cart', JSON.stringify(cart)); //set cart
    navigate('/');
  }

  return (
    <div className="editpage checkout">
      <div className="edit-header">
        <h1>Checkout</h1>
      </div>
      <div className="container edit-content">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th style={{width: "25%"}}></th>
              <th style={{width: "25%"}}></th>
              <th style={{width: "25%"}}></th>
              <th style={{width: "25%"}}></th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.map((order, index) => (
              <tr key={index}>
                <td align="center" colSpan={1}><div className="card"><div className="card-body"><img className="card-img" src={order.imageUrl} alt=""/></div></div></td>
                <td colSpan={2}>{order.name}</td>
                <td colSpan={1}>€{order.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot style={{borderTop: "1px solid lightgray"}}>
            <tr>
              <td colSpan={2}>Total</td>
              <td colSpan={2}>€{total}</td>
            </tr>
          </tfoot>
        </table>
        <Button variant="warning" size="lg" style={{width: "100%"}} onClick={handleClick}>Place Order</Button>
      </div>
    </div>
  );
}