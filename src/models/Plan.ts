import { Price } from "./Price";

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
  permissions: any[];
}
