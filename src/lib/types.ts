export interface IUser {
  id: string;
  username: string;
  password?: string;
  status: string;
}

export interface ICategory {
  category: string;
}

export interface ICategoryProduct {
  id: string;
  title: string;
  image: string;
  price: number;
}

export interface ICategories extends ICategory {
  products: ICategoryProduct[];
}
