// Utility functions for orders
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
  }).format(value);
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-MZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
