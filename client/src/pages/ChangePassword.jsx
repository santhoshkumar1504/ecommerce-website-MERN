import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../assets/styles/auth.css";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    oldPass: "",
    newPass: "",
  });

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Submit password change
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.oldPass || !formData.newPass) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPass.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        "http://localhost:5000/api/v1/users/change-password",
        formData,
        { withCredentials: true }
      );

      toast.success("Password changed successfully");
      // clear inputs after success
      setFormData({
        oldPass: "",
        newPass: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Password change failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container my-3">
      <div className="edit-profile-card">
        <h3>Change Password</h3>

        <form onSubmit={handleSubmit}>
          <label>Old Password</label>
          <input
            type="password"
            name="oldPass"
            value={formData.oldPass}
            onChange={handleChange}
            placeholder="Enter old password"
            required
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPass"
            value={formData.newPass}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
