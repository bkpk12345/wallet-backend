const { Schema, model, Types } = require("mongoose");
const { ObjectId } = Types;
const transactionTypeEnum = ["CREDIT", "DEBIT"];
const transactionSchema = new Schema(
  {
    amount: { type: Number },
    balance: { type: Number },
    transactionType: { type: String, enum: transactionTypeEnum },
    message: { type: String },
    date: { type: Date },
    walletId: { type: ObjectId, ref: "Wallet" },
  },
  { timestamps: true }
);

const transactionModel = model("Transaction", transactionSchema);
module.exports = { Transaction: transactionModel };
