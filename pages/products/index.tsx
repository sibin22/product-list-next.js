import React, { useState } from "react";
import { GetStaticProps } from "next";
import { Product, Review } from "../../util/types";
import { ProductReviewModal } from "@/components/ProductModal";
import { DataTable } from "@/components/table";
import { Button } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";

interface ProductsPageProps {
  products: Product[];
}

const ProductsPage: React.FC<ProductsPageProps> = ({ products }) => {
  const [openModal, setOpenModal] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  //fetch api call for products by its id and take the reviews from product
  const fetchReviews = async (productId: number): Promise<Review[]> => {
    const res = await fetch(`https://dummyjson.com/products/${productId}`);
    const product = await res.json();
    return product.reviews;
  };

  //view Review page
  const viewReviews = async (productId: number) => {
    setSelectedProductId(productId);
    const reviews = await fetchReviews(productId);
    setReviews(reviews);
    setOpenModal(true);
  };

  //modal close function
  const handleClose = () => {
    setOpenModal(false);
    setSelectedProductId(null);
  };

  //columns for tanstack table
  const columns: ColumnDef<Product, any>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ cell }) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
          }}
        >
          {cell.getValue<string>()}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}`,
    },
    {
      accessorKey: "discountPercentage",
      header: "Discount",
      cell: ({ getValue }) => `${(getValue() as number).toFixed(1)}%`,
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ getValue }) => (getValue() as number).toFixed(1),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ getValue }) => `${(getValue() as number).toLocaleString()}pcs`,
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ getValue }) => (getValue() as string[]).join(", "),
    },
    {
      accessorKey: "brand",
      header: "Brand",
      cell: ({ getValue }) =>
        (getValue() as string) ? (getValue() as string) : "-",
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outlined"
          size="small"
          sx={{ fontSize: "10px", fontWeight: "bolder" }}
          onClick={() => viewReviews(row.original.id)}
        >
          View Reviews
        </Button>
      ),
    },
  ];

  return (
    <>
      {/* product table component */}
      <DataTable columns={columns} data={products} />
      {/* product review modal */}
      <ProductReviewModal
        open={openModal}
        handleClose={handleClose}
        reviews={reviews}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();

    if (!Array.isArray(data.products)) {
      console.error("Fetched data is not an array:", data.products);
      return { props: { products: [] } };
    }

    return { props: { products: data.products } };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { props: { products: [] } };
  }
};

export default ProductsPage;
