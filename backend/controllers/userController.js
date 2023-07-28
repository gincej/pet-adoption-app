const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ _id: id }, process.env.SECRET, { expiresIn: "1d" });
};

const loginUser = async (req, res) => {
  const { userInfo, password } = req.body;

  try {
    const user = await User.login(userInfo, password);
    const token = createToken(user._id);
    res
      .status(201)
      .json({ id: user._id, token, role: user.role, alert: user.alert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, password, name, username } = req.body;

  try {
    const user = await User.signup(email, password, name, username);
    const token = createToken(user._id);
    res.status(201).json({ id: user._id, token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editUser = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;
  const foundUser = await User.findById(id);

  const { location, isOrganisation, organisationTitle } = req.body;
  const locationJson = JSON.parse(location);
  const userImage = req.file?.filename;

  if (!foundUser.equals(user)) {
    return res
      .status(401)
      .json({ error: "Neturite teisės redaguoti profilio." });
  }

  const userToEdit = await User.findOneAndUpdate(
    { _id: id },
    { location: locationJson, isOrganisation, organisationTitle, userImage }
  );

  if (!userToEdit) {
    res.status(404).json({ error: "Toks vartotojas neegzistuoja." });
  }

  res.status(200).json(userToEdit);
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Toks vartotojas neegzistuoja." });
  }

  const singleUser = await User.findById(id);

  if (!singleUser) {
    return res.status(404).json({ error: "Toks vartotojas neegzistuoja." });
  }

  const userRating = await Review.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(id) } },
    { $group: { _id: null, averageRating: { $avg: "$rating" } } },
  ]);

  const averageRating = userRating[0]?.averageRating || 0;

  delete singleUser.password;
  res.status(200).json({ singleUser, averageRating });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Toks vartotojas neegzistuoja." });
  }

  const userToDelete = await User.findOneAndDelete({ _id: id });

  if (!userToDelete) {
    return res.status(404).json({ error: "Toks vartotojas neegzistuoja." });
  }
  res.status(200).json(userToDelete);
};

const getAllUsers = async (req, res) => {
  const allUsers = await User.find({}).sort({ createdAt: -1 });

  if (getAllUsers.length === 0) {
    return res.status(404).json({ error: "Nėra naudotojų." });
  }

  const userRatings = await Review.aggregate([
    {
      $match: {
        user: { $in: allUsers.map((id) => new mongoose.Types.ObjectId(id)) },
      },
    },
    { $group: { _id: "$user", averageRating: { $avg: "$rating" } } },
  ]);

  const usersWithAverageRating = allUsers.map((user) => {
    const userRating = userRatings.find((rating) =>
      rating._id.equals(user._id)
    );
    const averageRating = userRating ? userRating.averageRating : 0;
    return { ...user.toObject(), averageRating };
  });

  res.status(200).json(usersWithAverageRating);
};

const sendAlert = async (req, res) => {
  const { id } = req.params;

  const { alert } = req.body;

  if (!alert) {
    return res
      .status(400)
      .json({ error: "Perspėjimo tekstas negali būti tuščias." });
  }

  const userToEdit = await User.findOneAndUpdate({ _id: id }, { alert });

  if (!userToEdit) {
    res.status(404).json({ error: "Toks vartotojas neegzistuoja." });
  }

  res
    .status(200)
    .json({ message: "Naudotojui sėkmingai išsiųstas perspėjimas." });
};

const removeAlert = async (req, res) => {
  const { id } = req.params;

  const userToEdit = await User.findOneAndUpdate({ _id: id }, { alert: "" });

  if (!userToEdit) {
    res.status(404).json({ error: "Toks vartotojas neegzistuoja." });
  }

  res
    .status(200)
    .json({ message: "Naudotojo perspėjimas panaikintas sėkmingai." });
};

module.exports = {
  loginUser,
  signupUser,
  editUser,
  getSingleUser,
  deleteUser,
  getAllUsers,
  sendAlert,
  removeAlert,
};
