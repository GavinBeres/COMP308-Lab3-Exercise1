const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    volunteers: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HelpRequest", helpRequestSchema);