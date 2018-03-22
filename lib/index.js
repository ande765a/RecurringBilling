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
const dates_1 = require("./dates");
const Plan_1 = require("./models/Plan");
var TransactionAction;
(function (TransactionAction) {
    TransactionAction["reserved"] = "reserved";
    TransactionAction["captured"] = "captured";
    TransactionAction["failed"] = "failed";
    TransactionAction["none"] = "none";
})(TransactionAction = exports.TransactionAction || (exports.TransactionAction = {}));
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
exports.processSubscription = ({ emailSender }) => (subscription) => {
    const now = new Date(Date.now());
    const transactionResults = subscription.transactions.map((transaction) => __awaiter(this, void 0, void 0, function* () {
        switch (transaction.state) {
            case Transaction_1.TransactionState.pending: {
                const reserveDate = dates_1.addDateDelta(transaction.due_date, subscription.plan.reserve_delta);
                if (reserveDate >= now) {
                    try {
                        yield transaction.reserve();
                        return {
                            transaction,
                            action: TransactionAction.reserved
                        };
                    }
                    catch (err) {
                        const { customer } = subscription;
                        yield emailSender.sendEmail(customer.email, `
            Hi ${customer.name}
            We were unable to reserve the amount for maintaining your subscription for the next period.
            Please check that your card information is up to date.
            Best regards
            SubReader
            `);
                        return {
                            transaction,
                            action: TransactionAction.failed
                        };
                    }
                }
            }
            case Transaction_1.TransactionState.reserved: {
                if (transaction.due_date >= now) {
                    try {
                        yield transaction.capture();
                        const nextDueDate = calculateNextDueDate(subscription);
                        yield subscription.createTransaction({
                            due_date: nextDueDate
                        });
                        yield subscription.setExpirationDate(dates_1.addDateDelta(nextDueDate, dates_1.createDateDelta({ days: 5 })));
                        yield subscription.setPeriod(subscription.period + 1);
                        return {
                            transaction,
                            action: TransactionAction.captured
                        };
                    }
                    catch (err) {
                        yield transaction.fail();
                        return {
                            transaction,
                            action: TransactionAction.failed
                        };
                    }
                }
            }
            default: {
                return {
                    transaction,
                    action: TransactionAction.none
                };
            }
        }
    }));
    return Promise.all(transactionResults);
};
exports.processSubscriptions = (deps) => (subscriptions) => {
    const now = new Date(Date.now());
    const subscriptionResults = subscriptions
        .filter(({ cancelled, expiration_date }) => {
        if (cancelled || now >= expiration_date) {
            return false;
        }
        return true;
    })
        .map((subscription) => __awaiter(this, void 0, void 0, function* () {
        const transactionResults = yield exports.processSubscription(deps)(subscription);
        return {
            subscription,
            transactionResults
        };
    }));
    return Promise.all(subscriptionResults);
};
