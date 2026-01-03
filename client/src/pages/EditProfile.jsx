import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import '../assets/styles/auth.css';

const EditProfile = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode:""
  });

  // 🔹 Load user data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/users", {
        withCredentials: true
      })
      .then((res) => {
        const user = res.data.data.isUser;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          pincode:user.pincode || ""
        });
      })
      .catch(() => {
        toast.error("Failed to load profile");
      });
  }, []);

  // 🔹 Handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Submit update
   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        "http://localhost:5000/api/v1/users/update-profile",
        formData,
        { withCredentials: true }
      );

      toast.success("Profile updated successfully");
    } catch (error) {
  console.log("UPDATE ERROR 👉", error.response || error);
  toast.error(
    error.response?.data?.message || "Profile update failed"
  );
}
 finally {
    setLoading(false);
  }

    
  };


  return (
    <div className="edit-profile-container my-3">
      <div className="edit-profile-card">
        <h3>Edit Profile</h3>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            disabled
          />

          <label>Phone</label>
          <input
          required
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Address</label>
          <textarea
            name="address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <label>Pincode</label>
          <input
          required
            name="pincode"
            type="text"
            value={formData.pincode}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
