"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionState;
(function (TransactionState) {
    TransactionState[TransactionState["pending"] = 0] = "pending";
    TransactionState[TransactionState["reserved"] = 1] = "reserved";
    TransactionState[TransactionState["captured"] = 2] = "captured";
    TransactionState[TransactionState["failing"] = 3] = "failing";
})(TransactionState = exports.TransactionState || (exports.TransactionState = {}));
