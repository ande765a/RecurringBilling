import { ISubscription } from "./models/Subscription";
import { TransactionState, ITransaction } from "./models/Transaction";
import { Currency } from "./models/Currency";
import { addDateDelta, createDateDelta } from "./dates";
import { BillingFrequency } from "./models/Plan";
import { IEmailSender } from "./email";

export enum TransactionAction {
  reserved = "reserved",
  captured = "captured",
  failed = "failed",
  none = "none"
}

export type TransactionResult = {
  transaction: ITransaction;
  action: TransactionAction;
};

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

export const processSubscription = ({
  emailSender
}: {
  emailSender: IEmailSender;
}) => (subscription: ISubscription): Promise<TransactionResult[]> => {
  const now = new Date(Date.now());
  const transactionResults = subscription.transactions.map(
    async transaction => {
      switch (transaction.state) {
        case TransactionState.pending: {
          const reserveDate = addDateDelta(
            transaction.due_date,
            subscription.reserve_delta
          );
          if (reserveDate >= now) {
            try {
              await transaction.reserve();
              return {
                transaction,
                action: TransactionAction.reserved
              };
            } catch (err) {
              const { customer } = subscription;
              await emailSender.sendEmail(
                customer.email,
                `
            Hi ${customer.name}
            We were unable to reserve the amount for maintaining your subscription for the next period.
            Please check that your card information is up to date.
            Best regards
            SubReader
            `
              );
              return {
                transaction,
                action: TransactionAction.failed
              };
            }
          }
        }
        case TransactionState.reserved: {
          if (transaction.due_date >= now) {
            try {
              await transaction.capture();
              const nextDueDate = calculateNextDueDate(subscription);
              await subscription.createTransaction({
                due_date: nextDueDate
              });
              await subscription.setExpirationDate(
                addDateDelta(nextDueDate, createDateDelta({ days: 5 }))
              );
              await subscription.setPeriod(subscription.period + 1);

              return {
                transaction,
                action: TransactionAction.captured
              };
            } catch (err) {
              await transaction.fail();
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
    }
  );
  return Promise.all(transactionResults);
};

export type SubscriptionResult = {
  subscription: ISubscription;
  transactionResults: TransactionResult[];
};

export const processSubscriptions = (deps: { emailSender: IEmailSender }) => (
  subscriptions: ISubscription[]
): Promise<SubscriptionResult[]> => {
  const now = new Date(Date.now());
  const subscriptionResults = subscriptions
    .filter(({ cancelled, expiration_date }) => {
      if (cancelled || now >= expiration_date) {
        return false;
      }
      return true;
    })
    .map(async subscription => {
      const transactionResults = await processSubscription(deps)(subscription);
      return {
        subscription,
        transactionResults
      };
    });
  return Promise.all(subscriptionResults);
};
