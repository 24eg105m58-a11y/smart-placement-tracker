const AdminDashboard = () => {
  return (
    <div>
      <h1
        className="
text-4xl
font-bold"
      >
        Admin Dashboard
      </h1>

      <div
        className="
grid
grid-cols-4
gap-6
mt-8"
      >
        {["Students", "Companies", "Drives", "Reports"].map((x) => (
          <div
            key={x}
            className="
bg-white
p-8
rounded-3xl
shadow"
          >
            {x}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
