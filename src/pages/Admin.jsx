import React, { memo, useCallback, useState } from "react";
import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import * as articlesApi from '../api/articles'
import * as ordersApi from '../api/orders';
import * as usersApi from '../api/users';
import * as orderlinesApi from '../api/orderlines';
import { formatDate, getErrorMessage } from "../components/GeneralMethods";
import config from '../config.json';
import { useSession, useTokenCheck } from "../contexts/AuthProvider";
import { Overlay, Tooltip } from "react-bootstrap";
import { useMessage } from "../contexts/DialogProvider";

export function Administration() {

  return (
    <div className="editpage admin">
      <div className="edit-header">
        <h1>Administration</h1>
      </div>
      <div className="d-flex">
        <div className="edit-items">
          <div className="list-group list-group-flush">
            <Link to="/administration" className="list-group-item list-group-item-action icon-text"><div><i className="bi bi-speedometer2"/></div><div>Dashboard</div></Link>
            <Link to="/administration/orders" className="list-group-item list-group-item-action icon-text"><div><i className="bi bi-card-checklist"/></div><div>Orders</div></Link>
            <Link to="/administration/customers" className="list-group-item list-group-item-action icon-text"><div><i className="bi bi bi-people"/></div><div>Customers</div></Link>
          </div>
        </div>
        <div className="edit-content"><Outlet/></div>
      </div>
    </div>
  );
}

const DashboardComponent = memo(function Dashboard() {
  const [ordersCount, setOrdersCount] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  const checkToken = useTokenCheck();

  const getData = useCallback(async () => {
    const count = await ordersApi.countAll();
    setOrdersCount(count.count);
    const recents = await ordersApi.getRecent();
    setRecentOrders(recents);
    const completed = await ordersApi.countCompleted();
    setCompletedOrdersCount(completed.count);
    const pending = await ordersApi.countPending();
    setPendingOrdersCount(pending.count);
    const users = await usersApi.countAll();
    setUsersCount(users.count);
  }, []);

  useEffect(() => {
    let interval = -1;
    const loadData = async () => {
      checkToken().then(getData);
      if(window.location.pathname !== '/administration') clearInterval(interval);
    };
    loadData();
    interval = setInterval(loadData, config.search_interval);
  }, [checkToken, getData]);

  return (
    <>
      <div className="row justify-content-center" style={{marginBottom: "3rem"}}>
        <div className="card-container">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{usersCount}</h5>
                  <p className="card-text">Customers</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{pendingOrdersCount}</h5>
                  <p className="card-text">Pending Orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-container">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{completedOrdersCount}</h5>
                  <p className="card-text">Completed Orders</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{ordersCount}</h5>
                  <p className="card-text">Total Orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="table-container">
        <div className="table-header">
          <h4>Recent Orders</h4>
          <Link to='/administration/orders' className="btn btn-primary">See all <i className="bi bi-arrow-right"></i></Link>
        </div>
        <table className="table table-borderless">
          <thead>
            <tr>
              <th>OrderID</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders && recentOrders.map((el) => 
              <tr key={el.order}>
                <td>{el.order}</td>
                <td>${parseFloat(el.price).toFixed(2)}</td>
                <td>{formatDate(new Date(el.date))}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    
    </>
  );
});
export function Dashboard() {
  return (<DashboardComponent/>);
}

export function Customers() {
  const [customers, setCustomers] = useState([]);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const customer = await usersApi.getAll();
      setCustomers(customer);
    }
    getData();
  }, []);

  const clickEmail = (e) => {
    navigator.clipboard.writeText(e.currentTarget.innerHTML);
  }

  return (
    <div className="table-container">
      <table className="table table-borderless">
        <thead>
          <tr>
            <th style={{width: "20%"}}>UserID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customers && customers.map((el) => 
            <tr key={el.id}>
              <td>{el.id}</td>
              <td>{el.name}</td>
              <td>
                <Link onClick={clickEmail} onMouseOver={(e) => setTarget(e.currentTarget)} onMouseOut={() => setTarget(null)}>{el.email}</Link>
                <Overlay target={target} show={target !== null} placement="top">
                  {(props) => (
                    <Tooltip id="overlay-tooltip" {...props}>
                      {target?.innerHTML}
                    </Tooltip>
                  )}
                </Overlay>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const OrdersComponent = memo(function Orders({MyOrders}) {
  const [showOrder, setShowOrder] = useState(-1);
  const [orders, setOrders] = useState([]);
  const [articles, setArticles] = useState([]);
  const { user } = useSession();

  const getData = useCallback(async () => {
    const order = MyOrders ? await ordersApi.getByUserId(user.id) : await ordersApi.getAll();
    setOrders(order);
    const article = await articlesApi.getAll();
    setArticles(article)
  }, [user, MyOrders]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
    <div className="table-container">
      <table className="table table-borderless table-striped-reverse">
        <thead>
          <tr>
            <th>OrderID</th>
            <th>Price</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.map(order => <Order key={order.order} data={order} articles={articles} showOrderState={{showOrder, setShowOrder}}/>)}
        </tbody>
      </table>
    </div>
    </>
  );
});
export function Orders(params) {
  return <OrdersComponent/>;
}

const Order = memo(function Order({data, articles, showOrderState}) {
  const {showOrder, setShowOrder} = showOrderState;
  const [orderlines, setOrderlines] = useState([]);
  const {setMessage, setMessageTitle, setShowMessage} = useMessage();

  const toggleOrder = useCallback(async (e) => {
    const id = parseInt(e.currentTarget.id);
    if(showOrder !== id) {
      setShowOrder(id);
      await orderlinesApi.getByOrderId(id).then((orderline) => {
        setOrderlines(orderline);
      }).catch((err) => {
        const error = getErrorMessage(err);
        setMessageTitle('Error');
        setMessage(error.message);
        setShowMessage(true);
      });
    }
    else {
      setShowOrder(-1);
      setOrderlines([]);
    }
  }, [showOrder, setShowOrder, setMessage, setShowMessage, setMessageTitle]);

  return (
    <>
      <tr className="order">
        <td>{data.order}</td>
        <td>${data.price}</td>
        <td>{formatDate(new Date(data.date))}</td>
        <td><Link id={data.order} onClick={toggleOrder}><i className={showOrder === data.order ? "bi bi-caret-down-fill" : "bi bi-caret-right-fill"}/></Link></td>
      </tr>
      {showOrder === data.order && 
        <tr className="orderline">
          <td colSpan={4}>
            {orderlines && orderlines.map((line) => <Orderline key={`${data.order}-${line.orderline}`} data={{name: articles.find((el) => el.id === line.article)?.name, ...line}}/>)}
          </td>
        </tr>
      }
    </>
  );
});

const Orderline = memo(function Orderline({data}) {
  const changeStatus = useCallback(async (e) => {
    await orderlinesApi.saveOrderline({ id: data.orderline, order: data.order, status: e.currentTarget.value });
  }, [data]);

  return (
    <table>
      <thead>
        <tr>
          <th>ItemID: {data.orderline}</th>
          <th colSpan={2}/>
          <th>
            <select className="form-select form-select-sm" aria-label="select" defaultValue={data.status} onChange={(e) => changeStatus(e)}>
              <option value="In Queue">In Queue</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Price:</td><td colSpan={3}>${data.price}</td></tr>
        <tr><td>Type:</td><td colSpan={3}>{data.name}</td></tr>
        <tr><td>Detailed background:</td><td colSpan={3}><input type="checkbox" className="form-check-input" disabled={true} checked={data.detailed}/></td></tr>
        <tr><td>Characters:</td><td colSpan={3}>{data.characters}</td></tr>
        <tr><td>Description:</td><td colSpan={3}><textarea className="form-control" disabled={true} defaultValue={data.description}/></td></tr>
        <tr><td>Reference:</td><td colSpan={3}><img className="img-fluid" src={data.imageUrl} alt="cat"></img></td></tr>
      </tbody>
    </table>
  );
});