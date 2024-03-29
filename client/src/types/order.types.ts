import { IFood } from "./Food.types";
import { IUser } from "./user.types";

export interface IFoodInfo {
  foods: [
    {
      food: IFood;
      quantity: number;
    },
  ];
  date: Date;
  paid: boolean;
  totalPrice: number;
}

export interface IOrder extends IFoodInfo {
  _id: string;
  user: IUser;
  status: string;
}
