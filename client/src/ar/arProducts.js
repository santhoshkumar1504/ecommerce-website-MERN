const arProducts = [
  {
    id: 1,
    name: "Chair",
    price: 899,
    rating: 3.4,
    modelSrc: "/models/chair.glb"
  },
  {
    id: 2,
    name: "Chair",
    price: 1099,
    rating: 4.5,
    modelSrc: "/models/chair1.glb"
  },
  {
    id: 3,
    name: "Clock",
    price: 599,
    rating: 4,
    modelSrc: "/models/clock.glb"
  },
  {
    id: 4,
    name: "Couch",
    price: 4999,
    rating: 4,
    modelSrc: "/models/couch.glb"
  },
  {
    id: 5,
    name: "Lenskart Blu Unisex Glass",
    price: 1499,
    rating: 4,
    modelSrc: "/models/glasses.glb"
  },
  {
    id: 6,
    name: "Headphone",
    price: 1999,
    rating: 4,
    modelSrc: "/models/headphone.glb"
  },
  {
    id: 7,
    name: "Headphones",
    price: 1499,
    rating: 3,
    modelSrc: "/models/headphones.glb"
  },
  {
    id: 8,
    name: "HP Victus Laptop",
    price: 79999,
    rating: 4,
    modelSrc: "/models/laptop.glb"
  },
  {
    id: 9,
    name: "Nokia",
    price: 3999,
    rating: 3,
    modelSrc: "/models/phone.glb"
  },
  {
    id: 10,
    name: "Black Shoe",
    price: 2999,
    rating: 4,
    modelSrc: "/models/shoes.glb"
  },
  {
    id: 11,
    name: "Samsung TV",
    price: 34999,
    rating: 4.5,
    modelSrc: "/models/tv.glb"
  },
  {
    id: 12,
    name: "Wooden Chair",
    price: 2599,
    rating: 4,
    modelSrc: "/models/woodenchair.glb"
  }
];

export default arProducts;







// const arProducts = models.map((file, index) => ({
//   id: index + 1,
//   name: file.replace(".glb", "").replace(/_/g, " "),
//   price: 459 + index * 100,
//   rating: 4,
//   modelSrc: `/models/${file}`,
//   iosSrc: "" // optional (USDZ only for iOS)
// }));

// export default arProducts;
