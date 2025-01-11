export interface OrderItem {
  id: number;
  price: number;
  num: number;
}
export interface IDish {
  id: number;
  name: string;
  cname: string;
  price: number;
  resource: string;
}
export interface IDishInfo {
  dish_info: IDish;
  number: number;
}
export interface orderDetail {
  dishName: string;
  num: number;
  price: number;
}
