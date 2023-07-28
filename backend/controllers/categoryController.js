const Category = require("../models/categoryModel");
const mongoose = require("mongoose");
require("dotenv").config();

const getAllCategories = async (req, res) => {
  const allCategories = await Category.find({});

  if (allCategories.length === 0) {
    return res.status(404).json({ error: "Nėra duomenų." });
  }

  res.status(200).json(allCategories);
};

// const getAllData = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "Toks objektas neegzistuoja." });
//   }

//   const data = await Category.findById(id);

//   if (!data) {
//     return res.status(404).json({ error: "Nėra duomenų." });
//   }

//   res.status(200).json(data);
// };

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Toks objektas neegzistuoja." });
  }

  const categoryToDelete = await Category.findOneAndDelete({ _id: id });

  if (!categoryToDelete) {
    return res.status(404).json({ error: "Toks objektas neegzistuoja." });
  }
  res.status(200);
};

const postCategory = async (req, res) => {
  const { animal, breeds, traits, lengths, colors } = req.body;

  if (
    !animal ||
    breeds.length == 0 ||
    traits.length == 0 ||
    colors.length == 0
  ) {
    return res.status(400).json({
      error: "Gyvūnas, veislės, savybės ir spalvos negali būti tuščios.",
    });
  }

  try {
    const newCategory = await Category.create({
      animal,
      breeds,
      traits,
      lengths,
      colors,
    });
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Toks objektas neegzistuoja." });
  }

  const { breeds, traits, lengths, colors } = req.body;

  if (breeds.length == 0 || traits.length == 0 || colors.length == 0) {
    return res.status(400).json({
      error: "Gyvūnas, veislės, savybės ir spalvos negali būti tuščios.",
    });
  }

  const categoryToEdit = await Category.findOneAndUpdate(
    { _id: id },
    {
      breeds,
      traits,
      lengths,
      colors,
    }
  );

  if (!categoryToEdit) {
    return res.status(404).json({ error: "Toks objektas neegzistuoja." });
  }

  res.status(200).json(categoryToEdit);
};

module.exports = {
  getAllCategories,
  postCategory,
  deleteCategory,
  editCategory,
};
