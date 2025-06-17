"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface Product {
  product_id?: number;
  name: string;
  price: number;
  sale_price: number;
  stock_quantity: number;
  product_stock_available: string;
  image_url: string;
}

export default function StockManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`);
      const data = await res.json();
      const validData: Product[] = (Array.isArray(data) ? data : data.products || []).map((p: Partial<Product>) => ({
        product_id: p.product_id,
        name: p.name ?? "",
        price: p.price ?? 0,
        sale_price: p.sale_price ?? 0,
        stock_quantity: p.stock_quantity ?? 0,
        product_stock_available: p.product_stock_available ?? "",
        image_url: p.image_url ?? "",
      }));
      setProducts(validData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (
    id: number,
    field: keyof Product,
    value: string | number
  ) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.product_id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = async (product: Product) => {
    if (!product.product_id) {
      toast.error("Missing product ID");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${product.product_id}/stock`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stock_quantity: product.stock_quantity,
            product_stock_available: product.product_stock_available,
          }),
        }
      );

      if (res.ok) {
        toast.success("Stock updated");
        setEditingRow(null);
        fetchProducts();
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <SidebarProvider>
      
      <SidebarInset>
        <SidebarTrigger className="-ml-1" />
        <div className="p-4">
          <h1 className="text-xl font-semibold mb-4">Stock Management</h1>
          <div className="overflow-auto rounded bg-white shadow">
            <table className="w-full text-sm text-left table-auto">
              <thead className="bg-white border-b font-medium">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Sale</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Available</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.product_id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{product.product_id}</td>
                    <td className="p-2">
                      <Image
                        src={product.image_url || "/placeholder.png"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                    </td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">₹{product.price}</td>
                    <td className="p-2">₹{product.sale_price}</td>
                    {editingRow === product.product_id ? (
                      <>
                        <td className="p-2">
                          <Input
                            type="number"
                            value={product.stock_quantity ?? 0}
                            onChange={(e) =>
                              handleChange(
                                product.product_id!,
                                "stock_quantity",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            value={product.product_stock_available ?? ""}
                            onChange={(e) =>
                              handleChange(
                                product.product_id!,
                                "product_stock_available",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 space-x-2">
                          <Button size="sm" onClick={() => handleSave(product)}>
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
                        <td className="p-2">{product.stock_quantity}</td>
                        <td className="p-2">{product.product_stock_available}</td>
                        <td className="p-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingRow(product.product_id!)}
                          >
                            Edit
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
