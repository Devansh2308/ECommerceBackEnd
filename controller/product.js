const Product = require("./../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({ err: "No such product Product" });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ err: "Problem WIth Image" });
    }

    const { name, description, Price, category, stock } = fields;
    if (!name || !description || !Price || !category || !stock) {
      return res.status(400).json({ err: "Please Include all Fields" });
    }

    let product = new Product(fields);

    //handle files
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({ err: "Files Size Too big" });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({ err: "Product Not Saved Succesfully" });
      }
      return res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({ err: "Problem WIth Image" });
    }

    let product = req.product;
    product = _.extend(product, fields);

    //handle files
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({ err: "Files Size Too big" });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({ err: "Product Not Updated Succesfully" });
      }
      return res.json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({ err: "Failed to delete Product" });
    }
    return res.json({ message: "deletion Succesful", deletedProduct });
  });
};

exports.getAllProducts = (req, res, next) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({ err: "No Product Found" });
      }

      res.json(products);
    });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } }
      }
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({ err: "Bulk Operation Failed" });
    }
    next();
  });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({ err: "No categories Found" });
    }
    return res.json(category);
  });
};
