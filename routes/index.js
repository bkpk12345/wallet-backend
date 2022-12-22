const express = require("express");
const router = express.Router();

const walletCtrl = require("../api/controllers/wallet");

router.post("/setup", walletCtrl.walletSetup);
router.post("/transact/:walletId", walletCtrl.creditDebitWallet);
router.get("/transactions", walletCtrl.getTransactions);
router.get("/wallet/:walletId", walletCtrl.getWallet);

module.exports = router;
