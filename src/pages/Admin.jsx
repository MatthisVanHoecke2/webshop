import { Link, Outlet } from "react-router-dom";

export function Administration() {
  return (
    <div className="profilemain">
      <div className="profile-header">
        <h1>Administration</h1>
      </div>
      <div className="d-flex">
        <div className="profile-items">
          <div className="list-group list-group-flush">
            <Link to="/administration/orders" className="list-group-item list-group-item-action icon-text"><div><i className="bi bi-card-checklist"/></div><div>Orders</div></Link>
            <Link to="/administration/orders" className="list-group-item list-group-item-action icon-text"><div><i className="bi bi bi-people"/></div><div>Users</div></Link>
          </div>
        </div>
        <div className="profile-content"><Outlet/></div>
      </div>
    </div>
  );
}