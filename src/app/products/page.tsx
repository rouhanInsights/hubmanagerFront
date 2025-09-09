"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/** Allow numeric fields to be number | "" while typing to avoid NaN in React value */
interface Product {
  product_id?: number;
  name: string;
  category_id: string;
  category_name?: string; // for display
  created_at?: string; // for display
  price: number | "";
  sale_price: number | "";
  stock_quantity: number | "";
  product_stock_available: boolean; // keep as string unless you want boolean
  product_published: boolean;
  product_featured: boolean;
  product_visibility: boolean;
  product_tax: number | "";
  weight: string;
  product_short_description: string;
  description: string;
  image_url: string;
}

/** Helper: parse number input, return "" if empty/invalid during typing */
const parseNumberInput = (raw: string, integer = false): number | "" => {
  if (raw === "" || raw === undefined || raw === null) return "";
  const n = integer ? parseInt(raw, 10) : parseFloat(raw);
  return Number.isNaN(n) ? "" : n;
};

/** Helper: format currency-like numbers safely in the table */
const safeMoney = (v: unknown): string => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
};

export default function ProductListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [modalProduct, setModalProduct] = useState<Product>({
    name: "",
    category_id: "",
    price: 0,
    sale_price: 0,
    stock_quantity: 0,
    product_stock_available: true,
    product_published: true,
    product_featured: false,
    product_visibility: true,
    product_tax: 0,
    weight: "",
    product_short_description: "",
    description: "",
    image_url: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`
      );
      const data = await res.json();
      const validData: Product[] = Array.isArray(data)
        ? data
        : data.products || [];
      setProducts(validData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login first");
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          router.push("/login");
        } else {
          fetchProducts();
        }
      })
      .catch((err) => {
        console.error("Auth error:", err);
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const openAddModal = () => {
    setModalProduct({
      name: "",
      category_id: "",
      price: 0,
      sale_price: 0,
      stock_quantity: 0,
      product_stock_available: true,
      product_published: true,
      product_featured: false,
      product_visibility: true,
      product_tax: 0,
      weight: "",
      product_short_description: "",
      description: "",
      image_url: "",
    });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalProduct({
      ...product,
      // ensure numeric fields are numbers (not undefined/null) when loading the form
      price: product.price === "" ? 0 : Number(product.price ?? 0),
      sale_price: product.sale_price === "" ? 0 : Number(product.sale_price ?? 0),
      stock_quantity:
        product.stock_quantity === "" ? 0 : Number(product.stock_quantity ?? 0),
      product_tax:
        product.product_tax === "" ? 0 : Number(product.product_tax ?? 0),
    });
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleModalChange = (
    field: keyof Product,
    value: string | number | boolean
  ) => {
    setModalProduct((prev) => ({ ...prev, [field]: value as any }));
  };

  const handleModalSubmit = async () => {
    // Normalize numeric fields to numbers for API payload
    const priceN = Number(modalProduct.price || 0);
    const salePriceN = Number(modalProduct.sale_price || 0);
    const stockQtyN = Number(modalProduct.stock_quantity || 0);
    const taxN = Number(modalProduct.product_tax || 0);

    if (priceN < 0 || salePriceN < 0 || stockQtyN < 0 || taxN < 0) {
      toast.error(
        "Price, Sale Price, Stock Quantity, and Tax must be 0 or more"
      );
      return;
    }

    const payload = {
      ...modalProduct,
      price: priceN,
      sale_price: salePriceN,
      stock_quantity: stockQtyN,
      product_tax: taxN,
    };

    const url = isEditMode
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${modalProduct.product_id}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`;
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(isEditMode ? "Product updated" : "Product added");
        setModalOpen(false);
        fetchProducts();
      } else {
        const txt = await res.text();
        toast.error(txt || "Save failed");
        console.error("Save failed:", txt);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id || !confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        toast.success("Deleted");
        fetchProducts();
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <SidebarProvider>
      <SidebarInset>
        <main className="p-4 bg-white rounded shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              className="w-full sm:w-1/2"
            />

            <Button onClick={openAddModal} className="w-full sm:w-auto">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          <div className="overflow-auto bg-white rounded shadow">
            <table className="w-full text-sm text-left table-auto">
              <thead className="bg-white border-b font-medium text-nowrap">
                <tr>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Sale</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Available</th>
                  <th className="p-2">Published</th>
                  <th className="p-2">Top(F)</th>
                  <th className="p-2">Best(V)</th>
                  <th className="p-2">Tax</th>
                  <th className="p-2">Weight</th>
                  <th className="p-2">Short Desc</th>
                  <th className="p-2">Desc</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product.product_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-2">
                      <Image
                        src={product.image_url || "/placeholder.png"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.category_id}</td>
                    <td className="p-2">₹{safeMoney(product.price)}</td>
                    <td className="p-2">₹{safeMoney(product.sale_price)}</td>
                    <td className="p-2">
                      {Number.isFinite(Number(product.stock_quantity))
                        ? Number(product.stock_quantity).toString()
                        : "0"}
                    </td>
                    <td className="p-2">
                      {product.product_stock_available ? "Yes" : "No"}
                    </td>
                    <td className="p-2">
                      {product.product_published ? "Yes" : "No"}
                    </td>
                    <td className="p-2">
                      {product.product_featured ? "Yes" : "No"}
                    </td>
                    <td className="p-2">
                      {product.product_visibility ? "Yes" : "No"}
                    </td>
                    <td className="p-2">₹{safeMoney(product.product_tax)}</td>
                    <td className="p-2">{product.weight}</td>
                    <td className="p-2">
                      {product.product_short_description}
                    </td>
                    <td className="p-2">{product.description}</td>
                    <td className="p-2 space-x-2">
                      <Button size="sm" onClick={() => openEditModal(product)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.product_id!)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Product" : "Add Product"}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(modalProduct).map(([key, val]) => {
                  const isReadonly =
                    isEditMode &&
                    ["product_id", "created_at", "category_id"].includes(key);

                  return (
                    <div key={key}>
                      <Label htmlFor={key}>
                        {{
                          product_featured: "Top Offers",
                          product_visibility: "Best Sellers",
                          category_id: "Category ID",
                          category_name: "Category Name",
                          created_at: "Created At",
                          description: "Description",
                          image_url: "Image URL",
                          name: "Name",
                          price: "Price",
                          product_id: "Product ID",
                          product_published: "Published",
                          product_short_description: "Short Description",
                          product_stock_available: "Stock Available",
                          product_tax: "Tax",
                          sale_price: "Sale Price",
                          stock_quantity: "Stock Quantity",
                          weight: "Weight",
                        }[key as keyof Product] || key.replace(/_/g, " ")}
                      </Label>

                      {key === "image_url" ? (
                        <div className="space-y-2">
                          <Input
                            id="image_url"
                            value={modalProduct.image_url}
                            placeholder="Enter image URL or upload"
                            onChange={(e) =>
                              handleModalChange("image_url", e.target.value)
                            }
                            disabled={isReadonly}
                          />
                          {!isReadonly && (
                            <Input
                              id="file"
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const formData = new FormData();
                                formData.append("file", file);
                                try {
                                  const res = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`,
                                    {
                                      method: "POST",
                                      body: formData,
                                    }
                                  );
                                  const data = await res.json();
                                  const url =
                                    data.secure_url ||
                                    data.url ||
                                    data.Location;
                                  if (url) {
                                    handleModalChange("image_url", url);
                                    toast.success("Image uploaded");
                                  } else {
                                    toast.error(
                                      data?.error || "Upload failed"
                                    );
                                  }
                                } catch (err) {
                                  toast.error("Upload error");
                                  console.error(err);
                                }
                              }}
                            />
                          )}
                        </div>
                      ) : ["product_published", "product_featured", "product_visibility", "product_stock_available"].includes(
                          key
                        ) ? (
                        <select
                          id={key}
                          value={val ? "Yes" : "No"}
                          onChange={(e) =>
                            handleModalChange(
                              key as keyof Product,
                              e.target.value === "Yes"
                            )
                          }
                          disabled={isReadonly}
                          className="w-full border px-2 py-1 rounded"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      ) : ["price", "sale_price", "stock_quantity", "product_tax"].includes(
                          key
                        ) ? (
                        <Input
                          id={key}
                          type="number"
                          value={val === "" ? "" : String(val)} // never pass NaN
                          min={0}
                          onChange={(e) =>
                            handleModalChange(
                              key as keyof Product,
                              key === "stock_quantity"
                                ? parseNumberInput(e.target.value, true) // int
                                : parseNumberInput(e.target.value, false) // float
                            )
                          }
                          disabled={isReadonly}
                        />
                      ) : isEditMode &&
                        ["product_id", "created_at", "category_name"].includes(
                          key
                        ) ? (
                        <Input id={key} value={val ?? ""} disabled />
                      ) : (
                        <Input
                          id={key}
                          value={val ?? ""}
                          onChange={(e) =>
                            handleModalChange(
                              key as keyof Product,
                              e.target.value
                            )
                          }
                          disabled={isReadonly}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <DialogFooter>
                <Button onClick={handleModalSubmit}>
                  {isEditMode ? "Update Product" : "Add Product"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
