const Pet = require("../models/petModel");
const mongoose = require("mongoose");
require("dotenv").config();

const getAllPets = async (req, res) => {
  const allPets = await Pet.find({})
    .sort({ createdAt: -1 })
    .populate(
      "author likes",
      "email username isOrganisation organisationTitle"
    );

  if (allPets.length === 0) {
    return res.status(404).json({ error: "Nėra rodomų gyvūnų." });
  }

  res.status(200).json(allPets);
};

const getSinglePet = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
  }

  const singlePet = await Pet.findById(id).populate(
    "author likes",
    "email username isOrganisation organisationTitle"
  );

  if (!singlePet) {
    return res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
  }

  res.status(200).json(singlePet);
};

const getUserPets = async (req, res) => {
  const { id } = req.params;
  const userPets = await Pet.find({ author: id }).populate(
    "author likes",
    "username email isOrganisation organisationTitle"
  );

  if (userPets.length === 0) {
    return res.status(404).json({ error: "Vartotojas dar neįkelė skelbimų." });
  }

  return res.status(200).json(userPets);
};

const createPet = async (req, res) => {
  const {
    name,
    category,
    breed,
    age,
    color,
    gender,
    furLength,
    description,
    contacts,
  } = req.body;

  const petImages = req.files.map((file) => file.filename);
  const location = JSON.parse(req.body.location);
  const traits = JSON.parse(req.body.traits);

  try {
    const author = req.user._id;
    const newPet = await Pet.create({
      name,
      category,
      breed,
      age,
      color,
      gender,
      description,
      traits,
      contacts,
      author,
      furLength,
      location,
      pictures: petImages,
    });
    res.status(200).json(newPet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePet = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
  }

  const pet = await Pet.findById(id);

  if (!pet.author.equals(user) && req.user.role != process.env.ADMIN) {
    return res
      .status(401)
      .json({ error: "Neturite teisės ištrinti skelbimo." });
  }

  const petToDelete = await Pet.findOneAndDelete({ _id: id });
  if (!petToDelete) {
    res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
  }

  res.status(200).json(petToDelete);
};

const editPet = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
  }

  const pet = await Pet.findById(id);

  if (!pet.author.equals(user)) {
    return res
      .status(401)
      .json({ error: "Neturite teisės redaguoti profilio." });
  }

  const petImages = req.files.map((file) => file.filename);
  const location = JSON.parse(req.body.location);
  const traits = JSON.parse(req.body.traits);

  const {
    name,
    category,
    breed,
    age,
    description,
    contacts,
    gender,
    furLength,
    color,
  } = req.body;

  if (
    !name ||
    !category ||
    !breed ||
    !age ||
    !description ||
    !contacts ||
    !gender ||
    !color ||
    petImages.length === 0 ||
    traits.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Visi laukai privalo būti užpildyti." });
  }

  const petToEdit = await Pet.findOneAndUpdate(
    { _id: id },
    {
      name,
      category,
      breed,
      age,
      description,
      furLength,
      contacts,
      traits,
      gender,
      color,
      location,
      pictures: petImages,
    }
  );

  if (!petToEdit) {
    res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
  }

  res.status(200).json(petToEdit);
};

const likePet = async (req, res) => {
  const petId = req.params.id;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(petId)) {
    return res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
  }

  const pet = await Pet.findById(petId);

  if (!pet) {
    return res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
  }

  if (pet.likes.includes(userId)) {
    pet.likes = pet.likes.filter(
      (likeId) => likeId.toString() !== userId.toString()
    );

    try {
      await pet.save();
      return res.status(200).json({ liked: false, likes: pet.likes });
    } catch (error) {
      return res.status(500).json({ error: "Įvyko klaida." });
    }
  } else {
    pet.likes.push(userId);

    try {
      await pet.save();
    } catch (error) {
      res.status(500).json({ error: "Įvyko klaida" });
    }
    res.status(200).json({ liked: true, likes: pet.likes });
  }
};

module.exports = {
  getAllPets,
  getSinglePet,
  createPet,
  deletePet,
  editPet,
  getUserPets,
  likePet,
};
