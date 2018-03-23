import { Price } from "./Price";
import { DateDelta } from "../dates";

export interface IPlan {
  id: string;
  price: Price;
  billing_interval: DateDelta;
  reserve_delta: DateDelta;
}
