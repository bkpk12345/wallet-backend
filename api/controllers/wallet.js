const { successHandler, errBuilder, isDef } = require("../helpers");
const Boom = require("@hapi/boom");
const { Transaction } = require("../models/transaction");
const { Wallet } = require("../models/wallet");

exports.walletSetup = async (req, res, next) => {
  try {
    let { balance, name } = req.body;
    console.log({ balance, name });
    if (!isDef(balance) || balance <= 0) {
      throw Boom.badData("Please add balance more than 0");
    }

    if (isDef(name) && name != "") {
      name = name.trim();
    } else name = "";
    const walletId = Date.now().toString(36);
    const walletBalance = new Number(balance.toFixed(4));
    console.log({ walletBalance });
    const newWallet = {
      id: walletId,
      balance: walletBalance,
      name,
      date: new Date(),
    };
    const savedWallet = await new Wallet(newWallet).save();

    const newTransactions = {
      id: Date.now().toString(36),
      amount: balance,
      balance: walletBalance,
      transactionType: "CREDIT",
      message: "first time wallet creditd",
      date: new Date(),
      walletId: savedWallet.id,
    };

    await new Transaction(newTransactions).save();

    return successHandler(res, savedWallet);
  } catch (error) {
    const resp = errBuilder(Boom.boomify(error));
    return next(resp);
  }
};
exports.creditDebitWallet = async (req, res, next) => {
  try {
    const { walletId } = req.params;
    const { amount, description } = req.body;

    if (!isDef(amount) || amount == 0) {
      throw Boom.badData("Plz provide proper amount number");
    }

    const existingWallet = await Wallet.findOne({ _id: walletId });
    console.log({ existingWallet });
    if (!isDef(existingWallet)) {
      throw Boom.notFound(`Wallet with id ${walletId} not found`);
    }

    let walletBalance = existingWallet.balance;
    const newWalletBalance = walletBalance + amount;
    if (newWalletBalance < 0) {
      throw Boom.badRequest("balance is low. Amount can not be debited");
    }

    const updatedWallet = await Wallet.findOneAndUpdate(
      {
        _id: walletId,
      },
      { balance: newWalletBalance }
    );

    //create new Transaction
    let transactionType = "CREDIT";
    if (amount < 0) {
      transactionType = "DEBIT";
    }
    const newTransactions = {
      id: Date.now().toString(36),
      amount: amount,
      balance: newWalletBalance,
      transactionType: transactionType,
      message: description,
      date: new Date(),
      walletId: walletId,
    };

    const savedTransaction = await new Transaction(newTransactions).save();
    const resObject = {
      balance: newWalletBalance,
      transactionId: savedTransaction._id,
    };
    return successHandler(res, resObject);
  } catch (error) {
    const resp = errBuilder(Boom.boomify(error));
    return next(resp);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const { walletId } = req.query;
    let { skip, limit } = req.query;

    if (!isDef(skip)) {
      skip = 0;
    } else skip = parseInt(skip);
    if (!isDef(limit)) {
      limit = 100;
    } else limit = parseInt(limit);

    if (!isDef(walletId)) {
      throw Boom.badData("Valid wallet id required");
    }

    const isWalletExists = await Wallet.findOne({ _id: walletId });

    if (!isDef(isWalletExists)) {
      throw Boom.notFound(`Wallet with id ${walletId} not exists`);
    }

    const filteredTransactions = await Transaction.find({ walletId: walletId }).skip(skip).limit(limit);

    return successHandler(res, filteredTransactions);
  } catch (error) {
    const resp = errBuilder(Boom.boomify(error));
    return next(resp);
  }
};

exports.getWallet = async (req, res, next) => {
  try {
    const { walletId } = req.params;

    if (!isDef(walletId)) {
      throw Boom.badData("Valid Wallet id required");
    }

    const wallet = await Wallet.findOne({ _id: walletId });
    return successHandler(res, wallet);
  } catch (error) {
    const resp = errBuilder(Boom.boomify(error));
    return next(resp);
  }
};
