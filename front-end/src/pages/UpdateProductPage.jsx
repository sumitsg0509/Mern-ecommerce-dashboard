import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import ProductForm from "../components/products/ProductForm";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";

export default function UpdateProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        const result = await api.getProduct(id);

        if (active) {
          setProduct(result);
        }
      } catch (error) {
        toast.error(error.message);
        navigate("/");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [id, navigate, toast]);

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      await api.updateProduct(id, values);
      toast.success("Product updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Edit Product"
        description="Update the details of this product."
      />

      <div className="max-w-2xl">
        {loading ? (
          <Card className="space-y-4 p-6">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </Card>
        ) : (
          product && (
            <ProductForm
              key={product._id}
              initialValues={product}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitLabel="Save changes"
              cancelTo="/"
            />
          )
        )}
      </div>
    </>
  );
}
