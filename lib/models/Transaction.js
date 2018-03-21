"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionState;
(function (TransactionState) {
    TransactionState["pending"] = "pending";
    TransactionState["reserved"] = "reserved";
    TransactionState["captured"] = "captured";
    TransactionState["failed"] = "failed";
})(TransactionState = exports.TransactionState || (exports.TransactionState = {}));
