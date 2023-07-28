const Request = require("../models/requestModel");
const Pet = require("../models/petModel");
const mongoose = require("mongoose");

const createRequest = async (req, res) => {
  const sender = req.user._id;
  const { text, owner, pet } = req.body;

  const exists = await Request.findOne({ sender, pet });

  if (exists) {
    return res.status(500).json({
      error: "Rezervaciją galima pateikti tik vieną kartą.",
    });
  }

  if (!text || text.length < 5) {
    res
      .status(500)
      .json({ error: "Įveskite tekstą, kurio ilgis bent 5 simboliai." });
  } else {
    try {
      await Request.create({ pet, owner, sender, text });
      res.status(200).json({ message: "Užklausa sėkmingai išsiųsta." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

const getSentRequests = async (req, res) => {
  const sender = req.user._id;

  const sentRequests = await Request.find({ sender })
    .sort({ createdAt: -1 })
    .populate(
      "pet owner",
      "name contacts username isOrganisation organisationTitle"
    );

  if (sentRequests.length === 0) {
    return res
      .status(404)
      .json({ error: "Jūs dar nesate pateikę rezervacijos užklausų." });
  }

  res.status(200).json(sentRequests);
};

const getReceivedRequests = async (req, res) => {
  const owner = req.user._id;

  const receivedRequests = await Request.find({ owner })
    .sort({ createdAt: -1 })
    .populate("pet sender", "name username isOrganisation organisationTitle");

  if (receivedRequests.length === 0) {
    return res
      .status(404)
      .json({ error: "Jūsų gyvūnai rezervacijos užklausų dar negavo." });
  }

  res.status(200).json(receivedRequests);
};

const removeRequest = async (req, res) => {
  const { id } = req.params;
  const user = req.user._id;
  const { petId } = req.body;
  const request = await Request.findById(id);
  const excludedStatuses = ["Priimta", "Atmesta", "Atšaukta kandidato"];

  if (!request.sender.equals(user)) {
    return res
      .status(401)
      .json({ error: "Neturite teisės atšaukti užklausos." });
  }

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(petId)
  ) {
    return res.status(404).json({ error: "Tokia užklausa neegzistuoja." });
  }

  try {
    await Request.findOneAndUpdate(
      { _id: id },
      { status: "Atšaukta kandidato" }
    );
    await Request.updateMany(
      {
        _id: { $ne: id },
        pet: petId,
        status: { $nin: excludedStatuses },
      },
      { $set: { status: "Laukiama" } }
    );

    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
    }

    pet.reserved = false;
    await pet.save();

    res.status(200).json({ message: "Užklausa atšaukta sėkmingai." });
  } catch (error) {
    res.status(500).json({ error: "Įvyko klaida" });
  }
};

const cancelRequest = async (req, res) => {
  const { id } = req.params;
  const { petId } = req.body;
  const user = req.user._id;
  const request = await Request.findById(id);
  const excludedStatuses = ["Priimta", "Atmesta", "Atšaukta kandidato"];

  if (!request.owner.equals(user)) {
    return res
      .status(401)
      .json({ error: "Neturite teisės atšaukti užklausos." });
  }

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(petId)
  ) {
    return res.status(404).json({ error: "Tokia užklausa neegzistuoja." });
  }

  try {
    await Request.findOneAndUpdate({ _id: id }, { status: "Atmesta" });
    await Request.updateMany(
      {
        _id: { $ne: id },
        pet: petId,
        status: { $nin: excludedStatuses },
      },
      { $set: { status: "Laukiama" } }
    );

    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
    }

    pet.reserved = false;
    await pet.save();

    res.status(200).json({ message: "Užklausa atmesta." });
  } catch (error) {
    res.status(500).json({ error: "Įvyko klaida" });
  }
};

const reservePet = async (req, res) => {
  const { id } = req.params;
  const { petId } = req.body;
  const user = req.user._id;
  const request = await Request.findById(id);
  const excludedStatuses = ["Atmesta", "Atšaukta kandidato"];

  if (!request.owner.equals(user)) {
    return res
      .status(401)
      .json({ error: "Neturite teisės valdyti užklausos." });
  }

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(petId)
  ) {
    return res.status(404).json({ error: "Tokia užklausa neegzistuoja." });
  }

  try {
    await Request.findOneAndUpdate({ _id: id }, { status: "Priimta" });
    await Request.updateMany(
      { _id: { $ne: id }, pet: petId, status: { $nin: excludedStatuses } },
      { $set: { status: "Rezervuota kitam vartotojui" } }
    );

    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ error: "Toks gyvūnas neegzistuoja." });
    }

    pet.reserved = true;
    await pet.save();

    res.status(200).json({ message: "Rezervacija įvykdyta." });
  } catch (error) {
    res.status(500).json({ error: "Įvyko klaida" });
  }
};

module.exports = {
  createRequest,
  getSentRequests,
  getReceivedRequests,
  reservePet,
  removeRequest,
  cancelRequest,
};
