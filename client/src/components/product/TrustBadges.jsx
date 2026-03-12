import React from "react";
import {
  FaTruckFast,
  FaMoneyBillWave,
  FaShieldHalved,
  FaArrowRotateLeft,
  FaRotate,
} from "react-icons/fa6";

const trustItems = [
  {
    id: 1,
    icon: <FaTruckFast />,
    title: "Free Delivery",
    subtitle: "On eligible orders",
  },
  {
    id: 2,
    icon: <FaMoneyBillWave />,
    title: "Cash on Delivery",
    subtitle: "Available in select areas",
  },
  {
    id: 3,
    icon: <FaShieldHalved />,
    title: "Secure Payment",
    subtitle: "100% safe checkout",
  },
  {
    id: 4,
    icon: <FaArrowRotateLeft />,
    title: "Easy Return",
    subtitle: "Simple return process",
  },
  {
    id: 5,
    icon: <FaRotate />,
    title: "Replacement Policy",
    subtitle: "Hassle-free replacement",
  },
];

const TrustBadges = () => {
  return (
    <div className="trust-wrapper">
      <h4 className="trust-heading">Offers & Trust</h4>

      <div className="trust-grid">
        {trustItems.map((item) => (
          <div className="trust-card" key={item.id}>
            <div className="trust-icon">{item.icon}</div>
            <div className="trust-content">
              <h6>{item.title}</h6>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .trust-wrapper {
          margin-top: 24px;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(12px);
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.08);
        }

        .trust-heading {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .trust-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: linear-gradient(135deg, #f8fafc, #eef2ff);
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 14px;
          transition: 0.3s ease;
        }

        .trust-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08);
        }

        .trust-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: linear-gradient(135deg, #111827, #374151);
          color: #fff;
          font-size: 18px;
        }

        .trust-content h6 {
          margin: 0 0 4px 0;
          font-size: 15px;
          font-weight: 700;
          color: #111827;
        }

        .trust-content p {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .trust-grid {
            grid-template-columns: 1fr;
          }

          .trust-wrapper {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .trust-card {
            padding: 12px;
            gap: 10px;
          }

          .trust-icon {
            width: 38px;
            height: 38px;
            min-width: 38px;
            font-size: 16px;
          }

          .trust-heading {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default TrustBadges;