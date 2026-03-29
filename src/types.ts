export interface Product {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: number;
  affiliate_url: string;
  image_url: string;
  images?: string[];
  category: string;
  click_count: number;
}

export type ProductInsert = Omit<Product, 'id' | 'created_at' | 'click_count'>;

export interface Blog {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string;
  author: string;
  category: string;
  slug: string;
}

export type BlogInsert = Omit<Blog, 'id' | 'created_at'>;
