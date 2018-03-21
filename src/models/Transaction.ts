import { ICustomer } from "./Customer";
import { Price } from "./Price";

export enum TransactionState {
  "pending",
  "reserved",
  "captured",
  "failing"
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