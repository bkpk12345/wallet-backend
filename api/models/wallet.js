const { Schema, model } = require("mongoose");
const walletSchema = new Schema(
  {
    balance: { type: Number, required: true },
    name: { type: String, trim: true },
    date: { type: Date },
  },
  { timestamps: true }
);

const walletModel = model("Wallet", walletSchema);
module.exports = { Wallet: walletModel };
