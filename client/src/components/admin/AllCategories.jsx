import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./style.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AllCategories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/categorys"
      );
      setCategories(res?.data?.data?.categoryExist);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= CREATE =================
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/v1/categorys/create-category",
        { title },
        { withCredentials: true }
      );

      toast.success("Category created successfully 🎉");
      setTitle("");
      fetchCategories();

      window.bootstrap.Modal.getInstance(
        document.getElementById("createModal")
      ).hide();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    }
  };

  // ================= UPDATE =================
  const handleEditClick = (cat) => {
    setSelectedId(cat._id);
    setTitle(cat.title);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/v1/categorys/${selectedId}`,
        { title },
        { withCredentials: true }
      );

      toast.success("Category updated successfully ✏️");
      fetchCategories();

      window.bootstrap.Modal.getInstance(
        document.getElementById("editModal")
      ).hide();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    }
  };

  // ================= DELETE =================
  const handleDeleteClick = (id) => {
    setSelectedId(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/categorys/${selectedId}`,
        { withCredentials: true }
      );

      toast.success("Category deleted successfully 🗑️");
      fetchCategories();

      window.bootstrap.Modal.getInstance(
        document.getElementById("deleteModal")
      ).hide();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <section className="section-1">
      {!loading && (
        <div>
          <div className="section-inner-head">
            <h2>Categories</h2>
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#createModal"
            >
              Add Category
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover inner-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((items) => (
                  <tr key={items._id}>
                    <td>{items.title}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-success"
                          data-bs-toggle="modal"
                          data-bs-target="#editModal"
                          onClick={() => handleEditClick(items)}
                        >
                          <FaEdit className="me-1" />
                          Edit
                        </button>

                        <button
                          className="btn btn-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteModal"
                          onClick={() => handleDeleteClick(items._id)}
                        >
                          <MdDelete className="me-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= CREATE MODAL ================= */}
      <div className="modal fade" id="createModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Category</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreate}>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Category Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <button className="btn btn-dark w-100">
                  Create Category
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      <div className="modal fade" id="editModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Category</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  className="form-control mb-3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <button className="btn btn-dark w-100">
                  Update Category
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      <div className="modal fade" id="deleteModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body text-center">
              <p>Are you sure you want to delete this category?</p>
              <button
                className="btn btn-danger w-100"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllCategories;