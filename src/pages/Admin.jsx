import { useCallback, useState } from "react";
import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import * as ordersApi from '../api/orders';
import * as usersApi from '../api/users';
import { formatDate } from "../components/GeneralMethods";
import config from '../config.json';
import { useTokenCheck } from "../contexts/AuthProvider";

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

export function Dashboard() {
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
}

export function Customers() {
  return (
    <>
    
    </>
  );
}

export function Orders() {
  const [showOrder, setShowOrder] = useState([]);

  const toggleOrder = (e) => {
    const id = parseInt(e.currentTarget.id);
    const orders = [...showOrder];
    if(!showOrder.includes(id)) orders.push(id);
    else orders.splice(orders.indexOf(id), 1);
    setShowOrder(orders);
  }

  return (
    <>
    <div className="table-container">
      <table className="table table-borderless">
        <thead>
          <tr>
            <th>OrderID</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>01/12/2022 18:00:00</td>
            <td><Link id={1} onClick={toggleOrder}><i className={showOrder.includes(1) ? "bi bi-caret-down-fill" : "bi bi-caret-right-fill"}/></Link></td>
          </tr>
          <tr></tr>
          <tr>
            <td>1</td>
            <td>01/12/2022 18:00:00</td>
            <td><Link id={2} onClick={toggleOrder}><i className={showOrder.includes(2) ? "bi bi-caret-down-fill" : "bi bi-caret-right-fill"}/></Link></td>
          </tr>
          <tr></tr>
          <tr>
            <td>1</td>
            <td>01/12/2022 18:00:00</td>
            <td><Link id={3} onClick={toggleOrder}><i className={showOrder.includes(3) ? "bi bi-caret-down-fill" : "bi bi-caret-right-fill"}/></Link></td>
          </tr>
        </tbody>
      </table>
    </div>
    </>
  );
}