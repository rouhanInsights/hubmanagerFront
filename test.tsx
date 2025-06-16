"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
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
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [newProduct, setNewProduct] = useState<Product>({
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
      const res = await fetch("http://localhost:5000/api/products");
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

    fetch("http://localhost:5000/api/users/profile", {
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

  const handleChange = (
    id: number,
    field: keyof Product,
    value: string | number | boolean
  ) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.product_id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleNewChange = (
    field: keyof Product,
    value: string | number | boolean
  ) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (product: Product, isNew = false) => {
    const url = isNew
      ? "http://localhost:5000/api/products"
      : `http://localhost:5000/api/products/${product.product_id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        toast.success(isNew ? "Product added" : "Product updated");
        setEditingRow(null);
        setNewProduct({
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
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const paginatedProducts = filtered.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between px-4 border-b mb-4 sticky top-0 z-3 bg-white">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Products</h1>
          </div>
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
                              <th className="p-2">Stock Available</th>
                              <th className="p-2">Published</th>
                              <th className="p-2">Top Offers(F)</th>
                              <th className="p-2">Best Sellers(V)</th>
                              <th className="p-2">Tax</th>
                              <th className="p-2">Weight</th>
                              <th className="p-2">Short Desc</th>
                              <th className="p-2">Desc</th>
                              <th className="p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Add new product row */}
                            <tr className="border-t bg-blue-50">
                              <td className="p-2">
                                <Input
                                  value={newProduct.image_url}
                                  onChange={(e) => handleNewChange("image_url", e.target.value)}
                                  placeholder="Image URL"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  value={newProduct.name}
                                  onChange={(e) => handleNewChange("name", e.target.value)}
                                  placeholder="Name"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  value={newProduct.category_id}
                                  onChange={(e) => handleNewChange("category_id", e.target.value)}
                                  placeholder="Cat ID"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  value={newProduct.price}
                                  onChange={(e) => handleNewChange("price", parseFloat(e.target.value))}
                                  type="number"
                                  placeholder="₹"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  value={newProduct.sale_price}
                                  onChange={(e) => handleNewChange("sale_price", parseFloat(e.target.value))}
                                  type="number"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  value={newProduct.stock_quantity}
                                  onChange={(e) =>
                                    handleNewChange("stock_quantity", parseInt(e.target.value))
                                  }
                                  type="number"
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  value={newProduct.product_stock_available}
                                  onChange={(e) =>
                                    handleNewChange("product_stock_available", e.target.value)
                                  }
                                  placeholder="true / false"
                                />
                              </td>
            
                              <td className="p-2">
                                <Input
                                  value={newProduct.product_published ? "Yes" : "No"}
                                  onChange={(e) =>
                                    handleNewChange("product_published", e.target.value === "Yes")
                                  }
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  value={newProduct.product_featured ? "Yes" : "No"}
                                  onChange={(e) =>
                                    handleNewChange("product_featured", e.target.value === "Yes")
                                  }
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  value={newProduct.product_visibility ? "Yes" : "No"}
                                  onChange={(e) =>
                                    handleNewChange("product_visibility", e.target.value === "Yes")
                                  }
                                />
                              </td>
                              <td className="p-2">
                                <Input
                                  value={newProduct.product_tax}
                                  onChange={(e) => handleNewChange("product_tax", e.target.value)}
                                />
                              </td>
                              <td className="p-2 truncate max-w-[80px]">
                                <Input
                                  value={newProduct.weight}
                                  onChange={(e) => handleNewChange("weight", e.target.value)}
                                />
                              </td>
                              <td className="p-2 truncate max-w-[900px]">
                                <Input
                                  value={newProduct.product_short_description}
                                  onChange={(e) =>
                                    handleNewChange("product_short_description", e.target.value)
                                  }
                                />
                              </td>
                              <td className="p-2 truncate max-w-[100px]">
                                <Input
                                  value={newProduct.description}
                                  onChange={(e) =>
                                    handleNewChange("description", e.target.value)}
                                />
            
                              </td>
                              <td className="p-2 space-x-2">
                                <Button size="sm" onClick={() => handleSave(newProduct, true)}>
                                  Add
                                </Button>
                              </td>
                            </tr>
            
                            {/* Product rows */}
                            {filtered.map((product) => (
                              <tr key={product.product_id} className="border-b hover:bg-gray-50">
                                {editingRow === product.product_id ? (
                                  <>
                                    <td className="p-2">
                                      <Input
                                        value={product.image_url}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "image_url", e.target.value)
                                        }
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Input
                                        value={product.name}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "name", e.target.value)
                                        }
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Input
                                        value={product.category_id}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "category_id", e.target.value)
                                        }
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Input
                                        type="number"
                                        value={product.price}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "price", parseFloat(e.target.value))
                                        }
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Input
                                        type="number"
                                        value={product.sale_price}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "sale_price", parseFloat(e.target.value))
                                        }
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Input
                                        type="number"
                                        value={product.stock_quantity}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "stock_quantity", parseInt(e.target.value))
                                        }
                                      />
            
                                    </td>
            
                                    <td className="p-2">
                                      <Input
                                        value={product.product_stock_available}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "product_stock_available", e.target.value)
                                        }
                                      />
                                    </td>
            
                                    <td className="p-2">
                                      <Input
                                        value={product.product_published ? "Yes" : "No"}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "product_published", e.target.value === "Yes")
                                        }
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Input
                                        value={product.product_featured ? "Yes" : "No"}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "product_featured", e.target.value === "Yes")
                                        }
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Input
                                        value={product.product_visibility ? "Yes" : "No"}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "product_visibility", e.target.value === "Yes")
                                        }
                                      />
                                    </td>
                                    <td className="p-2">
                                      <Input
                                        value={product.product_tax}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "product_tax", e.target.value)
                                        }
                                      />
                                    </td>
                                    <td className="p-2 truncate max-w-[80px]">
                                      <Input
                                        value={product.weight}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "weight", e.target.value)
                                        }
                                      />
                                    </td>
                                    <td className="p-2 truncate max-w-[90px]">
                                      <Input
                                        value={product.product_short_description}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "product_short_description", e.target.value)
                                        }
                                      />
                                    </td>
                                    <td className="p-2 truncate max-w-[100px]">
                                      <Input
                                        value={product.description}
                                        onChange={(e) =>
                                          handleChange(product.product_id!, "description", e.target.value)
                                        }
                                      />
                                    </td>
                                    <td className="p-2 space-x-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleSave(product)}
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingRow(null)}
                                      >
                                        Cancel
                                      </Button>
                                    </td>
                                  </>
                                ) : (
                                  <>
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
                                    <td className="p-2">₹{Number(product.price).toFixed(2)}</td>
                                    <td className="p-2">₹{Number(product.sale_price || 0).toFixed(2)}</td>
                                    <td className="p-2">{product.stock_quantity}</td>
                                    <td className="p-2">{product.product_stock_available}</td>
                                    <td className="p-2">{product.product_published ? "Yes" : "No"}</td>
                                    <td className="p-2">{product.product_featured ? "Yes" : "No"}</td>
                                    <td className="p-2">{product.product_visibility ? "Yes" : "No"}</td>
                                    <td className="p-2">{product.product_tax}</td>
                                    <td className="p-2 truncate max-w-[80px]">{product.weight}</td>
                                    <td className="p-2 truncate max-w-[90px]">{product.product_short_description}</td>
                                    <td className="p-2 truncate max-w-[100px]">{product.description}</td>
                                    <td className="p-2 space-x-2">
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() => setEditingRow(product.product_id!)}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleDelete(product.product_id!)}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex justify-center items-center gap-4 py-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}