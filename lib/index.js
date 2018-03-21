"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("./models/Transaction");
const Plan_1 = require("./models/Plan");
const dates_1 = require("./dates");
var TransactionAction;
(function (TransactionAction) {
    TransactionAction["none"] = "none";
    TransactionAction["reserve"] = "reserve";
    TransactionAction["capture"] = "capture";
})(TransactionAction || (TransactionAction = {}));
function getTransactionActions(subscription, io) {
    const now = new Date(Date.now());
    if (subscription.cancelled || subscription.expiration_date >= now) {
        return [];
    }
    const results = subscription.transactions.map((transaction) => __awaiter(this, void 0, void 0, function* () {
        switch (transaction.state) {
            case Transaction_1.TransactionState.pending: {
                const reserveDate = dates_1.addDateDelta(transaction.due_date, subscription.reserve_delta);
                if (reserveDate >= now) {
                    try {
                        yield transaction.reserve();
                    }
                    catch (err) {
                        // - Send email reminder, if card is not up to date
                        // DunningPolicy
                    }
                }
            }
            case Transaction_1.TransactionState.reserved: {
                if (transaction.due_date >= now) {
                    try {
                        yield transaction.capture();
                        const nextDueDate = calculateNextDueDate(subscription);
                        yield subscription.createTransaction({ due_date: nextDueDate });
                        yield subscription.setExpirationDate(dates_1.addDateDelta(nextDueDate, dates_1.createDateDelta({ days: 5 })));
                        yield subscription.setPeriod(subscription.period + 1);
                        //await io.setExpirationDate(subscription);
                        //await mutableActions.setExpirationDate(calculateDueDate(subscription));
                    }
                    catch (err) {
                        // Test
                    }
                }
            }
            case Transaction_1.TransactionState.failing: {
                // Send email or something? Cancel subscription at some point.
            }
            default: {
                return {
                    transaction,
                    action: TransactionAction.none
                };
            }
        }
    }));
}
exports.getTransactionActions = getTransactionActions;
function calculateNextDueDate(subscription) {
    const { start_date, period, plan } = subscription;
    switch (plan.frequency) {
        case Plan_1.BillingFrequency.daily: {
            return new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate() + (period + 1) * plan.interval);
        }
        case Plan_1.BillingFrequency.monthly: {
            return new Date(start_date.getFullYear(), start_date.getMonth() + (period + 1) * plan.interval, start_date.getDate());
        }
        case Plan_1.BillingFrequency.yearly: {
            return new Date(start_date.getFullYear() + (period + 1) * plan.interval, start_date.getMonth(), start_date.getDate());
        }
    }
}
exports.calculateNextDueDate = calculateNextDueDate;
/*calculateDueDate({
  customer: {
    id: "123"
  },
  plan: {
    price: {
      amount: 1000,
      currency: Currency.DKK
    },
    frequency: BillingFrequency.monthly,
    permissions: ["test"],
    interval: 1
  },
  start_date: new Date(2017, 0, 31),
  expiration_date: new Date(2018, 5, 20),
  period: 0,
  cancelled: false,
  transactions: []
});*/
function processSubscriptions(subscriptions) {
    //return subscriptions.map(processSubscription);
}
exports.processSubscriptions = processSubscriptions;
