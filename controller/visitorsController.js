const { Visitor } = require("../db/dbConnect");

const createVisitor = async (data) => {
  try {
    await Visitor.create(data);
  } catch (err) {
    console.error("Error creating visitor:", err);
    throw new Error("Error creating visitor");
  }
};

module.exports = { createVisitor };
