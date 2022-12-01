import { useState } from "react";
import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import * as ordersApi from '../api/orders';
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
  const [recentOrders, setRecentOrders] = useState([]);

  const checkToken = useTokenCheck();

  useEffect(() => {
    const loadData = async () => {
      checkToken().then(async () => {
        const count = await ordersApi.countAll();
        setOrdersCount(count.count);
        const recents = await ordersApi.getRecent();
        setRecentOrders(recents);
      })
    };
    loadData();
    setInterval(loadData, config.search_interval);
  }, [checkToken]);

  return (
    <>
      <div className="row justify-content-center" style={{marginBottom: "3rem"}}>
        <div className="card-container">
          <div className="row">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">54</h5>
                  <p className="card-text">Customers</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">79</h5>
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
                  <h5 className="card-title">124</h5>
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
          <button className="btn btn-primary">See all <i className="bi bi-arrow-right"></i></button>
        </div>
        <table className="table table-borderless">
          <thead>
            <tr>
              <th>OrderID</th>
              <th>User</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders && recentOrders.map((el) => 
              <tr key={el.order}>
                <td>{el.order}</td>
                <td>{el.user}</td>
                <td>{formatDate(new Date())}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    
    </>
  );
}

export function Users() {
  return (
    <>
    
    </>
  );
}

export function Orders() {
  return (
    <>
    
    </>
  );
}