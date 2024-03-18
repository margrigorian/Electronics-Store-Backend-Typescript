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

export interface IProduct {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  feildOfApplication: string;
  category: string;
  subcategory: string;
}

interface IAvgRate {
  rate: string | null;
}

export interface IProductWithRate extends IProduct, IAvgRate {}

export interface IProductListInfo {
  products: IProduct[];
  subcategories: string[];
  priceMin: number;
  priceMax: number;
  length: number;
}

// for product

export interface ICommentsWithRates {
  comment_id: number;
  comment: string;
  rate: number;
  user_id: number;
  username: string;
}

export interface IRates {
  user_id: number;
  rate: number;
}

export interface IProductWithCommentsAndRates extends IProduct {
  avgRating: number | null;
  comments: ICommentsWithRates[];
  rates: IRates[];
}

// for post rate or comment

export interface IProductComment {
  product_id: number;
  comment_id: number;
  comment: string;
  user_id: number;
}

export interface IProductRating {
  product_id: number;
  rate: number;
  user_id: number;
}
