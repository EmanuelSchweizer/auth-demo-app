export type ShoppingItem = {
  _id: string;
  name: string;
  bought: boolean;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  roleName: string;
  createdAt: string;
};
