import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const emptyValues = {
  name: "",
  price: "",
  brand: "",
  category: "",
};

const validate = (values) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Product name is required";
  }

  if (values.price === "" || values.price === null) {
    errors.price = "Price is required";
  } else if (Number.isNaN(Number(values.price))) {
    errors.price = "Enter a valid number";
  } else if (Number(values.price) < 0) {
    errors.price = "Price cannot be negative";
  }

  if (!values.brand.trim()) {
    errors.brand = "Brand is required";
  }

  if (!values.category.trim()) {
    errors.category = "Category is required";
  }

  return errors;
};

export default function ProductForm({
  initialValues,
  onSubmit,
  submitting = false,
  submitLabel = "Save product",
  cancelTo = "/",
  formId = "product-form",
}) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    ...emptyValues,
    ...(initialValues || {}),
    price: initialValues?.price ?? "",
  });
  const [errors, setErrors] = useState({});

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      name: values.name.trim(),
      price: Number(values.price),
      brand: values.brand.trim(),
      category: values.category.trim(),
    });
  };

  return (
    <Card className="p-5 sm:p-6">
      <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Product name"
            placeholder="e.g. iPhone 15 Pro"
            value={values.name}
            onChange={updateField("name")}
            error={errors.name}
            className="sm:col-span-2"
          />

          <Input
            label="Price (₹)"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 75000"
            value={values.price}
            onChange={updateField("price")}
            error={errors.price}
          />

          <Input
            label="Brand"
            placeholder="e.g. Apple"
            value={values.brand}
            onChange={updateField("brand")}
            error={errors.brand}
          />

          <Input
            label="Category"
            placeholder="e.g. Mobile"
            hint="Examples: Mobile, Laptop, Accessories"
            value={values.category}
            onChange={updateField("category")}
            error={errors.category}
            className="sm:col-span-2"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(cancelTo)}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button type="submit" loading={submitting}>
            <Save className="h-4 w-4" aria-hidden="true" />
            {submitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
