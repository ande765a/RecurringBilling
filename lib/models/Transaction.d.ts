import { ICustomer } from "./Customer";
import { Price } from "./Price";
export declare enum TransactionState {
    "pending" = 0,
    "reserved" = 1,
    "captured" = 2,
    "failing" = 3,
}
export interface ITransaction {
    id: string;
    price: Price;
    customer: ICustomer;
    state: TransactionState;
    due_date: Date;
    capture(): Promise<any>;
    reserve(): Promise<any>;
}
