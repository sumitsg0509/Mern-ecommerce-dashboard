import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import ProductForm from "../components/products/ProductForm";

export default function AddProductPage() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      await api.addProduct(values);
      toast.success("Product added successfully");
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
        title="Add Product"
        description="Create a new product for your catalogue."
      />

      <div className="max-w-2xl">
        <ProductForm
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Add product"
          cancelTo="/"
        />
      </div>
    </>
  );
}
