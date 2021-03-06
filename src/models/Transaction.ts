import { ICustomer } from "./Customer";
import { Price } from "./Price";

export enum TransactionState {
  pending = "pending",
  reserved = "reserved",
  captured = "captured",
  failed = "failed"
}

export interface ITransaction {
  id: string;
  price: Price;
  state: TransactionState;
  due_date: Date;

  capture(): Promise<any>;
  reserve(): Promise<any>;
  void(): Promise<any>;
  fail(): Promise<any>;
}
