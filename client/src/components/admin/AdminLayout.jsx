import './style.css'
const AdminLayout = () => {
    const stats = [
        {
            title: "Total Users",
            value: "1,245",
            icon: "bi-people-fill",
            color: "primary",
        },
        {
            title: "Revenue",
            value: "$32,890",
            icon: "bi-currency-dollar",
            color: "success",
        },
        {
            title: "Active Projects",
            value: "18",
            icon: "bi-kanban-fill",
            color: "warning",
        },
        {
            title: "Growth",
            value: "12.5%",
            icon: "bi-graph-up-arrow",
            color: "danger",
        },
    ];
    return (
        <div className="container-fluid p-4 bg-light min-vh-100">
            {/* Welcome Header */}
            <section className='section-1'>
                <div>
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h2 className="fw-bold">Welcome Back, Admin 👋</h2>
                            <p className="text-muted mb-0">
                                Here's what's happening with your platform today.
                            </p>
                        </div>
                    </div>
                    {/* Stats Cards */}
                    <div className="row g-4">
                        {stats.map((item, index) => (
                            <div key={index} className="col-12 col-md-6 col-lg-3">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-muted">{item.title}</h6>
                                            <h4 className="fw-bold">{item.value}</h4>
                                        </div>
                                        <div className={`text-${item.color} fs-1`}>
                                            <i className={`bi ${item.icon}`}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    )
}

export default AdminLayout
