const CHATBOT_FIELDS = require("../config/chatbotFields");

// update paths if needed
const Product = require("../../models/Products");
const Category = require("../../models/Category");

const getField = (obj, path) => obj?.[path];
const buildRegex = (value) => new RegExp(value, "i");

const formatProduct = (product, fields) => {
  return {
    _id: product._id,
    name: getField(product, fields.name),
    price:
      getField(product, fields.discountPrice) > 0
        ? getField(product, fields.discountPrice)
        : getField(product, fields.price),
    originalPrice: getField(product, fields.price),
    discountPrice: getField(product, fields.discountPrice),
    category: product.category?.title || null,
    brand: getField(product, fields.brand),
    stock: getField(product, fields.stock),
    featured: getField(product, fields.featured),
    description: getField(product, fields.description),

    // return fileName instead of pic id
    image: product.pic?.fileName || null,

    uuid: getField(product, fields.uuid),
  };
};

const formatCategory = (category, fields) => {
  return {
    _id: category._id,
    name: getField(category, fields.name),
    description: getField(category, fields.description),
  };
};

const applyPriceFilter = (query, fields, minPrice, maxPrice) => {
  const priceField = fields.discountPrice || fields.price;

  if (minPrice !== null || maxPrice !== null) {
    query[priceField] = {};
    if (minPrice !== null) query[priceField].$gte = minPrice;
    if (maxPrice !== null) query[priceField].$lte = maxPrice;
  }
};

const getMatchingCategoryIds = async (keyword) => {
  if (!keyword) return [];

  const categories = await Category.find({
    title: buildRegex(keyword),
  }).select("_id");

  return categories.map((cat) => cat._id);
};

const basePopulate = [
  { path: "category", select: "title" },
  { path: "pic", select: "fileName" },
];

const searchProductsService = async ({ keyword, minPrice, maxPrice }) => {
  const fields = CHATBOT_FIELDS.product;
  const query = {};

  if (keyword) {
    const matchedCategoryIds = await getMatchingCategoryIds(keyword);

    query.$or = [
      { [fields.name]: buildRegex(keyword) },
      { [fields.brand]: buildRegex(keyword) },
      { [fields.description]: buildRegex(keyword) },
      ...(matchedCategoryIds.length > 0
        ? [{ [fields.category]: { $in: matchedCategoryIds } }]
        : []),
    ];
  }

  applyPriceFilter(query, fields, minPrice, maxPrice);

  const products = await Product.find(query)
    .populate(basePopulate)
    .sort({ [fields.createdAt]: -1 })
    .limit(12);

  return products.map((item) => formatProduct(item, fields));
};

const featuredProductsService = async ({ keyword, minPrice, maxPrice }) => {
  const fields = CHATBOT_FIELDS.product;
  const query = {
    [fields.featured]: true,
  };

  if (keyword) {
    const matchedCategoryIds = await getMatchingCategoryIds(keyword);

    query.$or = [
      { [fields.name]: buildRegex(keyword) },
      { [fields.brand]: buildRegex(keyword) },
      { [fields.description]: buildRegex(keyword) },
      ...(matchedCategoryIds.length > 0
        ? [{ [fields.category]: { $in: matchedCategoryIds } }]
        : []),
    ];
  }

  applyPriceFilter(query, fields, minPrice, maxPrice);

  const products = await Product.find(query)
    .populate(basePopulate)
    .sort({ [fields.createdAt]: -1 })
    .limit(12);

  return products.map((item) => formatProduct(item, fields));
};

const discountedProductsService = async ({ keyword, minPrice, maxPrice }) => {
  const fields = CHATBOT_FIELDS.product;
  const query = {
    [fields.discountPrice]: { $gt: 0 },
  };

  if (keyword) {
    const matchedCategoryIds = await getMatchingCategoryIds(keyword);

    query.$or = [
      { [fields.name]: buildRegex(keyword) },
      { [fields.brand]: buildRegex(keyword) },
      { [fields.description]: buildRegex(keyword) },
      ...(matchedCategoryIds.length > 0
        ? [{ [fields.category]: { $in: matchedCategoryIds } }]
        : []),
    ];
  }

  if (minPrice !== null || maxPrice !== null) {
    query[fields.discountPrice] = query[fields.discountPrice] || {};
    query[fields.discountPrice].$gt = 0;
    if (minPrice !== null) query[fields.discountPrice].$gte = minPrice;
    if (maxPrice !== null) query[fields.discountPrice].$lte = maxPrice;
  }

  const products = await Product.find(query)
    .populate(basePopulate)
    .sort({ [fields.createdAt]: -1 })
    .limit(12);

  return products.map((item) => formatProduct(item, fields));
};

const inStockProductsService = async ({ keyword, minPrice, maxPrice }) => {
  const fields = CHATBOT_FIELDS.product;
  const query = {
    [fields.stock]: { $gt: 0 },
  };

  if (keyword) {
    const matchedCategoryIds = await getMatchingCategoryIds(keyword);

    query.$or = [
      { [fields.name]: buildRegex(keyword) },
      { [fields.brand]: buildRegex(keyword) },
      { [fields.description]: buildRegex(keyword) },
      ...(matchedCategoryIds.length > 0
        ? [{ [fields.category]: { $in: matchedCategoryIds } }]
        : []),
    ];
  }

  applyPriceFilter(query, fields, minPrice, maxPrice);

  const products = await Product.find(query)
    .populate(basePopulate)
    .sort({ [fields.createdAt]: -1 })
    .limit(12);

  return products.map((item) => formatProduct(item, fields));
};

const categoriesService = async () => {
  const fields = CHATBOT_FIELDS.category;

  const categories = await Category.find({})
    .sort({ [fields.createdAt]: -1 })
    .limit(20);

  return categories.map((item) => formatCategory(item, fields));
};

module.exports = {
  searchProductsService,
  featuredProductsService,
  discountedProductsService,
  inStockProductsService,
  categoriesService,
};