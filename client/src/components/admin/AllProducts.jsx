import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import './style.css'
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { TbSparkles } from "react-icons/tb";

const AllProducts = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [search, setSearch] = useState("");


    //     const handleSearch = async (value) => {
    //     const allProducts = res.data.data.productDetails;

    // const filtered = allProducts.filter((item) =>
    //     item.uuid?.toLowerCase().includes(value.toLowerCase()) ||
    //     item.productName?.toLowerCase().includes(value.toLowerCase()) ||
    //     item.category?.title?.toLowerCase().includes(value.toLowerCase())
    // );

    // setProducts(filtered);

    //     try {
    //         const res = await axios.get(
    //             `http://localhost:5000/api/v1/products?q=${value}`
    //         );

    //         setProducts(res.data.data.productDetails);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };


    const [formData, setFormData] = useState({
        productName: "",
        category: "",
        price: "",
        quantity: "",
        productDesc: "",
        discountedPrice: "",
        brand: "",
        pic: null,
        isFeatured: false,   // ✅ add this
    });
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    //   categories
    useEffect(() => {
        axios
            .get('http://localhost:5000/api/v1/categorys')
            .then((res) => {
                const list = res?.data?.data?.categoryExist;
                setCategories(list);   // ✅ Correct
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [])


    const handleFileChange = (e) => {
        setFormData({ ...formData, pic: e.target.files[0] });
    };

    // Add product modal requires start
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "isFeatured") {
                    data.append(key, formData[key] ? "true" : "false");
                } else {
                    data.append(key, formData[key]);
                }
            });

            const response = await axios.post(
                "http://localhost:5000/api/v1/products/add-product",
                data,
                { withCredentials: true }
            );

            if (response.data.status) {

                toast.success("Product added successfully 🎉");

                // 🔥 Re-fetch products
                const updatedProducts = await axios.get(
                    "http://localhost:5000/api/v1/products"
                );

                setProducts(updatedProducts.data.data.productDetails);

                // 🔥 Reset form
                setFormData({
                    productName: "",
                    category: "",
                    price: "",
                    quantity: "",
                    productDesc: "",
                    discountedPrice: "",
                    brand: "",
                    pic: null,
                    isFeatured: false,   // ✅ add this
                });

                // 🔥 Close modal manually
                const modal = document.getElementById("addproduct");
                const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide();
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Error occurred");
        }
    };

    const handleEditClick = (product) => {
        setSelectedId(product._id);

        setFormData({
            productName: product.productName,
            category: product.category.title,
            price: product.price,
            quantity: product.quantity,
            productDesc: product.productDesc,
            discountedPrice: product.discountedPrice,
            brand: product.brand,
            pic: null, // optional for edit
            isFeatured: product.isFeatured,
        });
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "isFeatured") {
                    data.append(key, formData[key] ? "true" : "false");
                } else if (formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });

            await axios.put(
                `http://localhost:5000/api/v1/products/update-product/${selectedId}`,
                data,
                { withCredentials: true }
            );

            toast.success("Product updated successfully ✏️");

            const updatedProducts = await axios.get(
                "http://localhost:5000/api/v1/products"
            );

            setProducts(updatedProducts.data.data.productDetails);

            window.bootstrap.Modal.getInstance(
                document.getElementById("editProductModal")
            ).hide();

        } catch (error) {
            toast.error(error.response?.data?.message || "Error occurred");
        }
    };


    const handleDeleteProduct = async () => {
        try {
            await axios.delete(
                `http://localhost:5000/api/v1/products/${selectedId}`,
                { withCredentials: true }
            );

            toast.success("Product deleted successfully 🗑️");

            const updatedProducts = await axios.get(
                "http://localhost:5000/api/v1/products"
            );

            setProducts(updatedProducts.data.data.productDetails);

            window.bootstrap.Modal.getInstance(
                document.getElementById("deleteProductModal")
            ).hide();

        } catch (error) {
            toast.error(error.response?.data?.message || "Error occurred");
        }
    };

    //  QR download function
    const handleDownloadQR = async (qrPath, productName, uuid) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/${qrPath}`,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${productName}-${uuid}-QR.png`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("QR Code Downloaded ✅");
        } catch (error) {
            toast.error("Failed to download QR");
        }
    };

    // add product modal end

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/v1/products')
            .then((res) => {
                const list = res?.data?.data?.productDetails;
                setProducts(list);   // ✅ Correct
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const handleGenerateDescription = async () => {
        if (!formData.productName) {
            toast.error("Enter product name first");
            return;
        }

        try {
            setIsGenerating(true);

            const response = await axios.post(
                "http://localhost:5000/api/v1/ai/generate-description",
                {
                    title: formData.productName,
                }
            );
            setFormData((prev) => ({
                ...prev,
                productDesc: response.data.description,
            }));

            toast.success("AI description generated ✨");
        } catch (error) {
            console.log(error);
            toast.error("AI generation failed");
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <section className='section-1'>
            {!loading && <div>
                <div className='section-inner-head'>
                    <h2>Products</h2>
                    <div>
                        <div className="d-flex justify-content-between mb-3">
                            <input
                                type="text"
                                placeholder="Search by Name, UUID or Category..."
                                className="form-control w-100"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addproduct" data-bs-whatever="@mdo">Add Products</button>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover inner-table">
                        <thead>
                            <tr>
                                <th>Product Image</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>

                                {/* ✅ NEW COLUMN FOR UUID */}
                                <th>UUID</th>

                                {/* ✅ NEW COLUMN FOR QR */}
                                <th>QR Code</th>

                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products
                                .filter((item) => {
                                    const value = search.toLowerCase();

                                    return (
                                        item.productName?.toLowerCase().includes(value) ||
                                        item.uuid?.toLowerCase().includes(value) ||
                                        item.category?.title?.toLowerCase().includes(value)
                                    );
                                })
                                .map((items) => {
                                    return (
                                        <tr key={items._id}>
                                            {/* Image */}
                                            <td>
                                                <img
                                                    src={`http://localhost:5000/images/${items.pic.fileName}`}
                                                    alt="p-name"
                                                    className="p-img"
                                                />
                                            </td>

                                            <td>{items.productName}</td>

                                            <td>{items.category?.title}</td>

                                            <td>₹{items.price}</td>

                                            <td>{items.quantity}</td>

                                            {/* ✅ UUID DISPLAY */}
                                            <td>
                                                <span className="badge bg-dark">
                                                    {items.uuid}
                                                </span>
                                            </td>

                                            {/* ✅ QR IMAGE DISPLAY */}
                                            <td>
                                                {items.qrCode && (
                                                    <img
                                                        src={`http://localhost:5000/${items.qrCode}`}
                                                        alt="QR"
                                                        style={{ width: "80px", cursor: "pointer" }}
                                                        onClick={() => handleDownloadQR(items.qrCode, items.productName, items.uuid)}
                                                    />
                                                )}
                                            </td>

                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn btn-success"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editProductModal"
                                                        onClick={() => handleEditClick(items)}
                                                    >
                                                        <FaEdit className="me-1" />
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="btn btn-danger"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#deleteProductModal"
                                                        onClick={() => setSelectedId(items._id)}
                                                    >
                                                        <MdDelete className="me-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>}


            <div className="modal fade" id="addproduct" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Product</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} encType="multipart/form-data">

                                {/* Product Name */}
                                <div className="mb-3">
                                    <label className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        name="productName"
                                        className="form-control"
                                        value={formData.productName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={`ai-generate-btn ${isGenerating ? "loading" : ""}`}
                                        onClick={!isGenerating ? handleGenerateDescription : undefined}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? (
                                            <span className="spinner"></span>
                                        ) : (
                                            <>
                                                <TbSparkles className="me-2 sparkle-icon" />
                                                Generate with AI
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Category */}
                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <div className="mb-3">
                                        <select
                                            name="category"
                                            className="form-control"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Category</option>

                                            {categories.map((category) => (
                                                <option key={category._id} value={category.title}>
                                                    {category.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>

                                {/* Brand */}
                                <div className="mb-3">
                                    <label className="form-label">Brand</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        className="form-control"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label">
                                        Featured Product
                                    </label>
                                </div>
                                {/* Price */}
                                <div className="mb-3">
                                    <label className="form-label">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="form-control"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Discounted Price */}
                                <div className="mb-3">
                                    <label className="form-label">Discounted Price</label>
                                    <input
                                        type="number"
                                        name="discountedPrice"
                                        className="form-control"
                                        value={formData.discountedPrice}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Quantity */}
                                <div className="mb-3">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        className="form-control"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label className="form-label">Product Description</label>
                                    <textarea
                                        name="productDesc"
                                        className="form-control"
                                        rows="3"
                                        value={formData.productDesc}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                {/* Image Upload */}
                                <div className="mb-3">
                                    <label className="form-label">Product Image</label>
                                    <input
                                        type="file"
                                        name="pic"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-dark w-100">
                                    Add Product
                                </button>
                            </form>
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" >Close</button>
                            <button type="button" className="btn btn-primary">Send message</button>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="modal fade" id="editProductModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Product</h5>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdateProduct} encType="multipart/form-data">

                                <input
                                    type="text"
                                    name="productName"
                                    className="form-control mb-3"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    required
                                />

                                <select
                                    name="category"
                                    className="form-control mb-3"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    {categories.map((category) => (
                                        <option key={category._id} value={category.title}>
                                            {category.title}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    name="brand"
                                    className="form-control mb-3"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    type="number"
                                    name="price"
                                    className="form-control mb-3"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    type="number"
                                    name="discountedPrice"
                                    className="form-control mb-3"
                                    value={formData.discountedPrice}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    type="number"
                                    name="quantity"
                                    className="form-control mb-3"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />

                                <textarea
                                    name="productDesc"
                                    className="form-control mb-3"
                                    value={formData.productDesc}
                                    onChange={handleChange}
                                    required
                                ></textarea>

                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label">
                                        Featured Product
                                    </label>
                                </div>

                                <input
                                    type="file"
                                    name="pic"
                                    className="form-control mb-3"
                                    onChange={handleFileChange}
                                />

                                <button className="btn btn-dark w-100">
                                    Update Product
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="deleteProductModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Delete</h5>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body text-center">
                            <p>Are you sure you want to delete this product?</p>
                            <button
                                className="btn btn-danger w-100"
                                onClick={handleDeleteProduct}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default AllProducts
