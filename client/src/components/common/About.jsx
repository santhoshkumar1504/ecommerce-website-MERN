import React from "react";
import shoe from "../../assets/png/running-shoe.png";
import phone from "../../assets/png/phone.png";
import headphone from "../../assets/png/headphone.png";
import cooler from "../../assets/png/cooler_black.png";
import watch from "../../assets/png/watch.png";
import dress from "../../assets/png/shirt.png";

const About = () => {
  const categories = [
    { img: watch, name: "Watches" },
    { img: shoe, name: "Shoes" },
    { img: phone, name: "Mobiles" },
    { img: headphone, name: "Headphones" },
    { img: cooler, name: "Glasses" },
    { img: dress, name: "Shirts" },
  ];

  return (
    <div className="about-section">
      <h2 className="about-title mt-4">Explore Our Products</h2>
      <hr className="hrline mb-4" />

      <div className="container">
        <div className="row justify-content-center">
          {categories.map((item, index) => (
            <div key={index} className="col-lg-2 col-md-4 col-sm-6 mb-4">
              <div className="category-card text-center">
                <img src={item.img} alt={item.name} />
                <h6 className="mt-3">{item.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;