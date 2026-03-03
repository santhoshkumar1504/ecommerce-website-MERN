import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./style.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AllUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [role, setRole] = useState("");

  const fetchUsers = async (searchValue = "") => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/users/all-user?search=${searchValue}`,
        { withCredentials: true }
      );

      setUsers(res?.data?.data?.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= SEARCH =================
  const handleSearch = () => {
    fetchUsers(search);
  };

  // ================= EDIT ROLE =================
  const handleEditClick = (user) => {
    setSelectedId(user._id);
    setRole(user.role);
  };

  const handleRoleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/users/add-admin/${selectedId}`,
        { role: Number(role) },
        { withCredentials: true }
      );

      toast.success("User role updated successfully 🔥");
      fetchUsers();

      const modalEl = document.getElementById("editUserModal");
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

    } catch (error) {
      console.log(error.response);
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  // ================= DELETE USER =================
  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/users/${selectedId}`,
        { withCredentials: true }
      );

      toast.success("User deleted successfully 🗑️");
      fetchUsers();

      window.bootstrap.Modal.getInstance(
        document.getElementById("deleteUserModal")
      ).hide();

    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <section className="section-1">
      {!loading && (
        <div>
          <div className="section-inner-head">
            <h2>Customer's Details</h2>
            <div className="d-flex">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="search"
                  placeholder="Search by name, email, or mobile..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover inner-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>{user.createdAt.substring(0, 10)}</td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#editUserModal"
                        onClick={() => handleEditClick(user)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-danger mt-1 me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteUserModal"
                        onClick={() => setSelectedId(user._id)}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========== EDIT ROLE MODAL ========== */}
      <div className="modal fade" id="editUserModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Edit User Role</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <select
                className="form-control mb-3"
                value={role}
                onChange={(e) => setRole(Number(e.target.value))}
              >
                <option value="1">1 - Super Admin</option>
                <option value="2">2 - Admin</option>
                <option value="3">3 - Moderator</option>
                <option value="4">4 - User</option>
              </select>

              <button
                className="btn btn-dark w-100"
                onClick={handleRoleUpdate}
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== DELETE MODAL ========== */}
      <div className="modal fade" id="deleteUserModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Confirm Delete</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body text-center">
              <p>Are you sure you want to delete this user?</p>
              <button
                className="btn btn-danger w-100"
                onClick={handleDeleteUser}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        {
          `
            .search-box {
  position: relative;
  width: 350px;
}

.search-box input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border-radius: 30px;
  border: 1px solid #ddd;
  outline: none;
  transition: 0.3s ease;
  font-size: 14px;
}

.search-box input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 14px;
}
  `
        }
      </style>
    </section>
  );
};

export default AllUsers;