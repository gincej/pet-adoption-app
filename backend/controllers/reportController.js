const Report = require("../models/reportModel");
const mongoose = require("mongoose");

const sendReport = async (req, res) => {
  const sender = req.user._id;
  const { text, user } = req.body;

  const exists = await Report.findOne({ sender, user });

  if (exists) {
    return res.status(500).json({
      error: "Pranešimą galima pateikti tik vieną kartą.",
    });
  }

  if (text.length > 300) {
    res.status(500).json({ error: "Įveskite tekstą iki 300 simbolių." });
  } else {
    try {
      await Report.create({ user, sender, text });
      res.status(200).json({ message: "Pranešimas sėkmingai išsiųstas." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const getAllReports = async (req, res) => {
  const allReports = await Report.find({})
    .sort({ createdAt: -1 })
    .populate("user sender", "username isOrganisation organisationTitle alert");

  if (allReports.length === 0) {
    return res
      .status(404)
      .json({ error: "Dar nėra pateiktų pranešimų apie netinkamą veiklą." });
  }

  res.status(200).json(allReports);
};

module.exports = {
  sendReport,
  getAllReports,
};
