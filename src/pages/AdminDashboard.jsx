import { useContext } from "react";
import { ComplaintContext } from "../context/ComplaintContext";

function AdminDashboard() {
  const { complaints, updateStatus } = useContext(ComplaintContext);

  return (
    <div className="container">
      {complaints.map(c => (
        <div key={c.id} className="card">
          <h3>{c.title}</h3>
          <select onChange={(e)=>updateStatus(c.id,e.target.value)}>
            <option>pending</option>
            <option>in-progress</option>
            <option>resolved</option>
          </select>
        </div>
      ))}
    </div>
  );
}
export default AdminDashboard;