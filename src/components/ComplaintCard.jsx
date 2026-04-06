function ComplaintCard({ c }) {
    return (
      <div className="card">
        <h3>{c.title}</h3>
        <p>{c.description}</p>
        <p>Dept: {c.department}</p>
        <p>Status: {c.status}</p>
        {c.image && <img src={c.image} width="120" />}
      </div>
    );
  }
  export default ComplaintCard;