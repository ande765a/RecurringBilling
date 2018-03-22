import { Price } from "./Price";
import { ICustomer } from "./Customer";
import { ITransaction } from "./Transaction";
import { IPlan } from "./Plan";
import { DateDelta } from "../dates";
import { BillingFrequency } from "./Plan";

export interface ISubscription {
  id: string;
  customer: ICustomer;
  plan: IPlan;
  start_date: Date;
  expiration_date: Date;
  period: number;
  cancelled: boolean;
  transactions: ITransaction[];

  createTransaction(opts: { due_date: Date }): Promise<ITransaction>;
  setExpirationDate(date: Date): Promise<any>;
  setPeriod(period: number): Promise<any>;
  cancel(): Promise<any>;
}
