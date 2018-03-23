import { Price } from "./Price";
import { DateDelta } from "../dates";
export interface IPlan {
    id: string;
    price: Price;
    billing_delta: DateDelta;
    reserve_delta: DateDelta;
}
