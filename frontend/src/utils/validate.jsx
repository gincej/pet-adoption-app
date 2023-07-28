import React from "react";

const validate = ({
  pictures,
  name,
  category,
  breed,
  age,
  color,
  location,
  gender,
  furLength,
  contacts,
  description,
  traits,
}) => {
  const emptyFields = [];

  if (!pictures || pictures.length === 0) {
    emptyFields.push("pictures");
  }

  if (!name) {
    emptyFields.push("name");
  }

  if (!category) {
    emptyFields.push("category");
  }

  if (!breed) {
    emptyFields.push("breed");
  }

  if (!age) {
    emptyFields.push("age");
  }

  if (!color) {
    emptyFields.push("color");
  }

  if (!location.city) {
    emptyFields.push("location");
  }

  if (!gender) {
    emptyFields.push("gender");
  }

  if (!contacts) {
    emptyFields.push("contacts");
  }

  if (!description) {
    emptyFields.push("description");
  }

  if (category !== "Roplys" && category !== "Paukštis" && !furLength) {
    emptyFields.push("length");
  }

  if (traits.length === 0) {
    emptyFields.push("traits");
  }

  return emptyFields;
};

export default validate;
