require("dotenv").config();

const checkAdmin = async (req, res, next) => {
  if (req.user.role == process.env.ADMIN) {
    next();
  } else {
    res.status(401).json({ error: "Jūs neturite administratoriaus teisių." });
  }
};

module.exports = checkAdmin;
