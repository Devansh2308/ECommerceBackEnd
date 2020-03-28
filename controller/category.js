const Category = require("./../models/category");

exports.getCategoryById = (req, res, next, id) => {
  console.log(req);
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({ err: "Category NOT Found" });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({ err: "Category Not Created" });
    }

    return res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, category) => {
    if (err) {
      return res.status(400).json({ error: "No category" });
    }

    return res.json(category);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  console.log(req.category);
  category.name = req.body.name;

  category.save((err, category) => {
    if (err) return res.status(400).json({ err: "UPDARE FAILED" });
    return res.json(category);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err)
      return res.status(400).json({ err: "FAILED to Delete this category" });
  });

  return res.json({ message: "Successfully deleted" });
};
