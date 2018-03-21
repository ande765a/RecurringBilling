import { ISubscription } from "./models/Subscription";
import { ITransaction } from "./models/Transaction";
export interface TransactionIO {
    reserveTransaction(transaction: ITransaction): Promise<any>;
    captureTransaction(transaction: ITransaction): Promise<any>;
    createTransaction(opts: any): Promise<ITransaction>;
}
export declare function getTransactionActions(subscription: ISubscription, io: TransactionIO): never[] | undefined;
export declare function calculateNextDueDate(subscription: ISubscription): Date;
export declare function processSubscriptions(subscriptions: ISubscription[]): void;
