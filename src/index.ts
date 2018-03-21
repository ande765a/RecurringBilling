import { ISubscription } from "./models/Subscription";
import { TransactionState, ITransaction } from "./models/Transaction";
import { BillingFrequency } from "./models/Plan";
import { Currency } from "./models/Currency";
import { addDateDelta, createDateDelta } from "./dates";

enum TransactionAction {
  none = "none",
  reserve = "reserve",
  capture = "capture"
}

type TransactionResult = {
  transaction: ITransaction;
  action: TransactionAction;
};

export interface TransactionIO {
  reserveTransaction(transaction: ITransaction): Promise<any>;
  captureTransaction(transaction: ITransaction): Promise<any>;
  createTransaction(opts: any): Promise<ITransaction>;
}

export function getTransactionActions(
  subscription: ISubscription,
  io: TransactionIO
) {
  const now = new Date(Date.now());
  if (subscription.cancelled || subscription.expiration_date >= now) {
    return [];
  }

  const results = subscription.transactions.map(async transaction => {
    switch (transaction.state) {
      case TransactionState.pending: {
        const reserveDate = addDateDelta(
          transaction.due_date,
          subscription.reserve_delta
        );
        if (reserveDate >= now) {
          try {
            await transaction.reserve();
          } catch (err) {
            // - Send email reminder, if card is not up to date
            // DunningPolicy
          }
        }
      }
      case TransactionState.reserved: {
        if (transaction.due_date >= now) {
          try {
            await transaction.capture();
            const nextDueDate = calculateNextDueDate(subscription);
            await subscription.createTransaction({ due_date: nextDueDate });
            await subscription.setExpirationDate(
              addDateDelta(nextDueDate, createDateDelta({ days: 5 }))
            );
            await subscription.setPeriod(subscription.period + 1);

            //await io.setExpirationDate(subscription);
            //await mutableActions.setExpirationDate(calculateDueDate(subscription));
          } catch (err) {
            // Test
          }
        }
      }
      case TransactionState.failing: {
        // Send email or something? Cancel subscription at some point.
      }
      default: {
        return {
          transaction,
          action: TransactionAction.none
        };
      }
    }
  });
}

export function calculateNextDueDate(subscription: ISubscription) {
  const { start_date, period, plan } = subscription;
  switch (plan.frequency) {
    case BillingFrequency.daily: {
      return new Date(
        start_date.getFullYear(),
        start_date.getMonth(),
        start_date.getDate() + (period + 1) * plan.interval
      );
    }
    case BillingFrequency.monthly: {
      return new Date(
        start_date.getFullYear(),
        start_date.getMonth() + (period + 1) * plan.interval,
        start_date.getDate()
      );
    }
    case BillingFrequency.yearly: {
      return new Date(
        start_date.getFullYear() + (period + 1) * plan.interval,
        start_date.getMonth(),
        start_date.getDate()
      );
    }
  }
}

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

export function processSubscriptions(subscriptions: ISubscription[]) {
  //return subscriptions.map(processSubscription);
}
