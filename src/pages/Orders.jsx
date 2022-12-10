import { Orders } from "./Admin";

export function MyOrders() {
  return (
    <div className="editpage admin">
      <div className="edit-header">
        <h1>My Orders</h1>
      </div>
      <div className="d-flex">
        <div className="edit-content"><Orders MyOrders={true}/></div>
      </div>
    </div>
  );
}