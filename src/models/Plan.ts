import { Price } from "./Price";
import { DateDelta } from "../dates";

export enum BillingFrequency {
  daily = "daily",
  monthly = "monthly",
  yearly = "yearly"
}

export interface IPlan {
  id: string;
  price: Price;
  frequency: BillingFrequency;
  interval: number;
  reserve_delta: DateDelta;
}
