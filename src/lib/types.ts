// For registration/login

export interface IUser {
  id: string;
  username: string;
  password?: string;
  status: string;
}

// For feildOfApplicationCategories and Products

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

// For middleware queriesParamsValidate

// export interface IProductQueriesParams {
//   search?: string;
//   category?: string | undefined;
//   subcategory?: string | undefined;
//   minPrice?: string | undefined;
//   maxPrice?: string | undefined;
//   order?: string | undefined;
//   page?: string;
//   limit?: string;
// }

// For product list

export interface IProducts {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  rate: number;
  feildOfApplication: string;
  category: string;
  subcategory: string;
}

export interface IProductListInfo {
  products: IProducts[];
  subcategories: string[];
  priceMin: number;
  priceMax: number;
  length: number;
}
