"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogOut, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface Product {
  product_id?: number;
  name: string;
  category_id: string;
  price: number;
  sale_price: number;
  stock_quantity: number;
  product_stock_available: string;
  product_published: boolean;
  product_featured: boolean;
  product_visibility: boolean;
  product_tax: string;
  weight: string;
  product_short_description: string;
  description: string;
  image_url: string;
}

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
    product_stock_available: "",
    product_published: true,
    product_featured: false,
    product_visibility: true,
    product_tax: "",
    weight: "",
    product_short_description: "",
    description: "",
    image_url: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`);
      const data = await res.json();
      const validData: Product[] = Array.isArray(data) ? data : data.products || [];
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
      product_stock_available: "",
      product_published: true,
      product_featured: false,
      product_visibility: true,
      product_tax: "",
      weight: "",
      product_short_description: "",
      description: "",
      image_url: "",
    });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalProduct(product);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleModalChange = (
    field: keyof Product,
    value: string | number | boolean
  ) => {
    setModalProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalSubmit = async () => {
    const url = isEditMode
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${modalProduct.product_id}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`;
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modalProduct),
      });
      if (res.ok) {
        toast.success(isEditMode ? "Product updated" : "Product added");
        setModalOpen(false);
        fetchProducts();
      } else {
        toast.error("Save failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id || !confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });
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
        <header className="flex h-16 items-center justify-between px-4 border-b mb-4 sticky top-0 z-3 bg-white">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Products</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openAddModal} className="text-sm">
              <PlusCircle className="w-4 h-4 mr-1" /> Add Product
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              variant="outline"
              className="text-sm"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="p-4 bg-white rounded shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              className="w-1/4"
            />
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
                  <tr key={product.product_id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <Image src={product.image_url || "/placeholder.png"} alt={product.name} width={40} height={40} className="w-10 h-10 object-cover rounded" />
                    </td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.category_id}</td>
                    <td className="p-2">₹{Number(product.price).toFixed(2)}</td>
                    <td className="p-2">₹{Number(product.sale_price || 0).toFixed(2)}</td>
                    <td className="p-2">{product.stock_quantity}</td>
                    <td className="p-2">{product.product_stock_available}</td>
                    <td className="p-2">{product.product_published ? "Yes" : "No"}</td>
                    <td className="p-2">{product.product_featured ? "Yes" : "No"}</td>
                    <td className="p-2">{product.product_visibility ? "Yes" : "No"}</td>
                    <td className="p-2">{product.product_tax}</td>
                    <td className="p-2">{product.weight}</td>
                    <td className="p-2">{product.product_short_description}</td>
                    <td className="p-2">{product.description}</td>
                    <td className="p-2">
                      <Button size="sm" onClick={() => openEditModal(product)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(product.product_id!)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reusable Modal for Add/Edit */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
  {Object.entries(modalProduct).map(([key, val]) => (
    <div key={key}>
      <Label htmlFor={key}>{key.replace(/_/g, " ")}</Label>
      {key === "image_url" ? (
        <div className="space-y-2">
          <Input
            id="image_url"
            value={modalProduct.image_url}
            placeholder="Enter image URL or upload"
            onChange={(e) => handleModalChange("image_url", e.target.value)}
          />
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
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`, {
                  method: "POST",
                  body: formData,
                });
                const data = await res.json();
                if (data.secure_url) {
                  handleModalChange("image_url", data.secure_url);
                  toast.success("Image uploaded");
                } else {
                  toast.error("Upload failed");
                }
              } catch (err) {
                toast.error("Upload error");
                console.error(err);
              }
            }}
          />
        </div>
      ) : (
        <Input
          id={key}
          value={typeof val === "boolean" ? (val ? "Yes" : "No") : val}
          onChange={(e) =>
            handleModalChange(
              key as keyof Product,
              ["product_published", "product_featured", "product_visibility"].includes(key)
                ? e.target.value === "Yes"
                : key === "price" || key === "sale_price"
                ? parseFloat(e.target.value)
                : key === "stock_quantity"
                ? parseInt(e.target.value)
                : e.target.value
            )
          }
        />
      )}
    </div>
  ))}
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
