import { ISubscription } from "./models/Subscription";
import { ITransaction } from "./models/Transaction";
import { IEmailSender } from "./email";
export declare enum TransactionAction {
    reserved = "reserved",
    captured = "captured",
    failed = "failed",
    none = "none",
}
export declare type TransactionResult = {
    transaction: ITransaction;
    action: TransactionAction;
};
export declare function calculateNextDueDate(subscription: ISubscription): Date;
export declare const processSubscription: ({ emailSender }: {
    emailSender: IEmailSender;
}) => (subscription: ISubscription) => Promise<TransactionResult[]>;
export declare type SubscriptionResult = {
    subscription: ISubscription;
    transactionResults: TransactionResult[];
};
export declare const processSubscriptions: (deps: {
    emailSender: IEmailSender;
}) => (subscriptions: ISubscription[]) => Promise<SubscriptionResult[]>;
