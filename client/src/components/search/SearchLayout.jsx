import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SearchLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const qp = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const q = qp.get("q") || "";
  const page = Number(qp.get("page") || 1);
  const size = Number(qp.get("size") || 12);
  const sort = qp.get("sort") || "newest";
  const brand = qp.get("brand") || "";
  const category = qp.get("category") || "";
  const price = qp.get("price") || ""; // example: "0-999" or "1000-1999"

  const [searchInput, setSearchInput] = useState(q);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  const setParam = (key, value) => {
    const next = new URLSearchParams(location.search);
    if (!value) next.delete(key);
    else next.set(key, String(value));
    // reset to page 1 when filters change
    if (key !== "page") next.set("page", "1");
    navigate(`/search?${next.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setParam("q", searchInput.trim());
  };

  useEffect(() => {
    if (!q) {
      setProducts([]);
      setMeta({ total: 0, pages: 0, count: 0 });
      return;
    }

    const fetch = async () => {
      try {
        setLoading(true);

        const url =
          `http://localhost:5000/api/v1/products?` +
          `search=${encodeURIComponent(q)}` +
          `&page=${page}` +
          `&size=${size}` +
          `&sort=${sort}` +
          (brand ? `&brand=${encodeURIComponent(brand)}` : "") +
          (category ? `&category=${encodeURIComponent(category)}` : "") +
          (price ? `&price=${encodeURIComponent(price)}` : "");

        const res = await axios.get(url);

        const data = res?.data?.data || {};
        setProducts(data.productDetails || []);
        setMeta({
          total: data.total || 0,
          pages: data.pages || 0,
          count: data.count || 0,
        });
      } catch (err) {
        setProducts([]);
        setMeta({ total: 0, pages: 0, count: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [q, page, size, sort, brand, category, price]);

  return (
    <div className="container mt-4">
      <div className="top-controls">
        <button className="btn btn-outline-dark" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
      </div>

      <div className="filters-bar">
        <input
          className="form-control"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setParam("brand", e.target.value)}
        />

        <input
          className="form-control"
          placeholder="Category"
          value={category}
          onChange={(e) => setParam("category", e.target.value)}
        />

        <select className="form-select" value={price} onChange={(e) => setParam("price", e.target.value)}>
          <option value="">Price: Any</option>
          <option value="0-999">0 - 999</option>
          <option value="1000-1999">1000 - 1999</option>
          <option value="2000-4999">2000 - 4999</option>
          <option value="5000-999999">5000+</option>
        </select>

        <select className="form-select" value={sort} onChange={(e) => setParam("sort", e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>

        <select className="form-select" value={size} onChange={(e) => setParam("size", e.target.value)}>
          <option value="8">8 / page</option>
          <option value="12">12 / page</option>
          <option value="16">16 / page</option>
          <option value="24">24 / page</option>
        </select>
      </div>

      <h5 className="mt-3">
        Results for: <span className="text-primary">{q}</span> — {meta.total} found
      </h5>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <p className="text-danger fs-5">No products found</p>
      ) : (
        <>
          <div className="row g-4 mt-2">
            {products.map((p) => (
              <div key={p._id} className="col-md-3 col-sm-6">
                <Link to={`/products/${p._id}`} className="text-decoration-none text-dark">
                  <div className="card border-0 shadow-lg h-100 product-card">
                    <div className="product-img-wrapper">
                      <img
                        src={`http://localhost:5000/images/${p.pic.fileName}`}
                        alt={p.productName}
                        className="img-fluid product-img"
                      />
                    </div>
                    <div className="card-body text-center">
                      <p className="text-muted small mb-1">{p.brand}</p>
                      <h6 className="fw-bold">{p.productName}</h6>
                      <p className="text-success fw-bold">₹{p.discountedPrice || p.price}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination-bar">
            <button
              className="btn btn-outline-dark"
              disabled={page <= 1}
              onClick={() => setParam("page", page - 1)}
            >
              Prev
            </button>

            <span className="page-info">
              Page <b>{page}</b> of <b>{meta.pages || 1}</b>
            </span>

            <button
              className="btn btn-outline-dark"
              disabled={meta.pages === 0 || page >= meta.pages}
              onClick={() => setParam("page", page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      <style>{`
        .top-controls{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
          flex-wrap:wrap;
          margin-bottom:14px;
        }
        .search-form{
          display:flex;
          gap:10px;
          width:min(520px, 100%);
        }
        .filters-bar{
          display:grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 140px;
          gap:10px;
          margin-top:10px;
        }
        @media (max-width: 992px){
          .filters-bar{ grid-template-columns: 1fr 1fr; }
        }

        .product-card {
          transition: all 0.3s ease;
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }
        .product-img-wrapper { height: 220px; overflow: hidden; }
        .product-img {
          height: 100%; width: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-img { transform: scale(1.1); }

        .pagination-bar{
          display:flex;
          justify-content:center;
          align-items:center;
          gap:14px;
          margin: 22px 0;
        }
        .page-info{ color:#333; }
      `}</style>
    </div>
  );
};

export default SearchLayout;