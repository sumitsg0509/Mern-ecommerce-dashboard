import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackageOpen, Plus, Search, SlidersHorizontal } from "lucide-react";
import api from "../api";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import StatsCards from "../components/products/StatsCards";
import ProductTable from "../components/products/ProductTable";
import ProductCards from "../components/products/ProductCards";

const PAGE_SIZE = 8;

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inventoryValue: 0,
    users: 0,
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const loadStats = useCallback(async () => {
    try {
      setStats(await api.getStats());
    } catch {
      // Stats are non-critical; keep the dashboard usable
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const result = await api.getProducts();
      setProducts(Array.isArray(result) ? result : []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const searchProducts = useCallback(
    async (key) => {
      setLoading(true);

      try {
        const result = await api.searchProducts(key);
        setProducts(Array.isArray(result) ? result : []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const delay = setTimeout(
      () => {
        if (search.trim()) {
          searchProducts(search.trim());
        } else {
          loadProducts();
        }
      },
      search.trim() ? 500 : 0
    );

    return () => clearTimeout(delay);
  }, [search, searchProducts, loadProducts]);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.category).filter(Boolean))
      ).sort(),
    [products]
  );

  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((product) => product.category === category);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        list.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name-asc":
        list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
        break;
      default:
        list.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }

    return list;
  }, [products, category, sort]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
  const pagedProducts = visibleProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const hasFilters = Boolean(search.trim()) || category !== "all";

  const refresh = useCallback(() => {
    if (search.trim()) {
      return searchProducts(search.trim());
    }

    return loadProducts();
  }, [search, searchProducts, loadProducts]);

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      await api.deleteProduct(deleteTarget._id);
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      await Promise.all([refresh(), loadStats()]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("newest");
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your products and store performance."
        actions={
          <Button onClick={() => navigate("/add")}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Product
          </Button>
        }
      />

      <StatsCards stats={stats} loading={loading && products.length === 0} />

      <Card className="mt-6 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
          <Input
            icon={Search}
            placeholder="Search products by name, brand or category..."
            aria-label="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="flex-1"
          />

          <div className="flex gap-3">
            <Select
              aria-label="Filter by category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-1/2 sm:w-40"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>

            <Select
              aria-label="Sort products"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="w-1/2 sm:w-44"
            >
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </Select>
          </div>
        </div>

        {/* Results meta */}
        <div className="flex items-center justify-between px-4 pt-3 text-xs text-slate-500">
          <span>
            {visibleProducts.length} product
            {visibleProducts.length === 1 ? "" : "s"}
            {hasFilters ? " found" : ""}
          </span>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
          hasFilters ? (
            <EmptyState
              icon={Search}
              title="No matching products"
              description="Try a different search term or clear the filters to see everything."
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={PackageOpen}
              title="No products yet"
              description="Add your first product to start building your catalogue."
              action={
                <Button onClick={() => navigate("/add")}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add product
                </Button>
              }
            />
          )
        ) : (
          <>
            <ProductTable products={pagedProducts} onDelete={setDeleteTarget} />
            <ProductCards products={pagedProducts} onDelete={setDeleteTarget} />
          </>
        )}

        {/* Pagination */}
        {!loading && visibleProducts.length > PAGE_SIZE && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, visibleProducts.length)} of{" "}
              {visibleProducts.length}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>

              <span className="px-2 font-medium text-slate-600">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently removed. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
