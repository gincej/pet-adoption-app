const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Pet = require("./petModel");
const Comment = require("./commentModel");
const Request = require("./requestModel");
const Review = require("./reviewModel");
const Report = require("./reportModel");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 25,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    likedPets: {
      type: Array,
      default: [],
    },
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
    },
    isOrganisation: {
      type: Boolean,
      default: false,
    },
    organisationTitle: {
      type: String,
      maxLength: 100,
    },
    userImage: {
      type: String,
    },
    alert: {
      type: String,
      maxLength: 200,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const userId = this.getQuery()["_id"];
    await Pet.deleteMany({ author: userId });
    await Comment.deleteMany({ author: userId });
    await Request.deleteMany({ $or: [{ sender: userId }, { owner: userId }] });
    await Review.deleteMany({ $or: [{ author: userId }, { user: userId }] });
    await Report.deleteMany({ $or: [{ sender: userId }, { user: userId }] });
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.statics.signup = async function (email, password, name, username) {
  if (!email || !password || !name || !username) {
    throw Error("Visi laukai privalo būti užpildyti.");
  }

  const emailExists = await this.findOne({ email });
  const usernameExists = await this.findOne({ username });

  if (emailExists) {
    throw Error("Toks el. paštas jau užregistruotas.");
  }

  if (usernameExists) {
    throw Error("Toks vartotojo vardas jau egzistuoja.");
  }

  if (
    !validator.isAlphanumeric(username, "en-US", { ignore: "_-" }) ||
    !validator.isLength(username, { min: 5, max: 25 })
  ) {
    throw Error(
      "Vartotojo vardas privalo būti sudarytas iš 5-25 raidžių, skaičių ar _ bei - simbolių."
    );
  }

  if (!validator.isAlpha(name, "en-US", { ignore: "ąĄĘęĖėĮįŠšŲųŪūČčŽž" })) {
    throw Error("Įvestame varde yra neleistinų simbolių.");
  }

  if (!validator.isEmail(email)) {
    throw Error("El. paštas neatitinka reikalavimų.");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Slaptažodis turi būti sudarytas mažiausiai iš 8 simbolių: turi turėti bent vieną didžiąją raidę, skaičių ir papildomą simbolį. "
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, name, username });

  return user;
};

userSchema.statics.login = async function (userInfo, typedPassword) {
  let isEmail = false;

  if (!userInfo || !typedPassword) {
    throw Error("Visi laukai privalo būti užpildyti.");
  }

  if (validator.isEmail(userInfo)) {
    isEmail = true;
  }

  const user = await this.findOne(
    isEmail ? { email: userInfo } : { username: userInfo }
  );

  if (!user) {
    throw Error("Toks vartotojas neegzistuoja.");
  }

  const match = await bcrypt.compare(typedPassword, user.password);

  if (!match) {
    throw Error("Neteisingas slaptažodis.");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
