import React from "react";
import { GetServerSideProps } from "next";
import ProductTable from "./products";
import { Product } from "../../util/types";

interface ProductsPageProps {
  products: Product[];
}

//fetch products api call
const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();
  return data.products;
};

const ProductsPage: React.FC<ProductsPageProps> = ({ products }) => {
  return (
    <>
      {/* //product table components and pass the products  */}
      <ProductTable data={products} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await fetchProducts();
  return {
    props: {
      products,
    },
  };
};

export default ProductsPage;
