export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatNumber = (value = 0) =>
  new Intl.NumberFormat("en-IN").format(Number(value) || 0);
