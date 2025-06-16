

"use client";

import { useEffect, useState,ChangeEvent  } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";



import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface Category {
  category_id: number;
  category_name: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load categories");
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
      headers: {    Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          router.push("/login");
        } else {
          fetchCategories();
        }
      })
      .catch((err) => {
        console.error("Auth error:", err);
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: newCategory }),
      });

      if (!res.ok) throw new Error();
      const updated = await res.json();
      toast.success("Category added");
      setCategories((prev) => [...prev, updated]);
      setNewCategory("");
    } catch {
      toast.error("Error adding category");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: editedName }),
      });
      if (!res.ok) throw new Error();
      toast.success("Category updated");
      setCategories((prev) =>
        prev.map((cat) =>
          cat.category_id === id ? { ...cat, category_name: editedName } : cat
        )
      );
      setEditingId(null);
    } catch {
      toast.error("Error updating category");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((cat) => cat.category_id !== id));
    } catch {
      toast.error("Error deleting category");
    }
  };

  const filtered = categories.filter((cat) =>
    cat.category_name.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
     <SidebarProvider>
          
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Hello User</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Update Categories</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
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
            <h2 className="text-lg font-semibold">Categories</h2>
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              className="w-1/4"
            />
          </div>

          <div className="flex gap-2 mb-6">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="w-1/3"
            />
            <Button onClick={handleAdd}>Add</Button>
          </div>

          <div className="space-y-2">
            {filtered.map((cat) => (
              <div
                key={cat.category_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded shadow-sm"
              >
                {editingId === cat.category_id ? (
                  <>
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-1/3"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdate(cat.category_id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-800 font-medium">{cat.category_name}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(cat.category_id);
                          setEditedName(cat.category_name);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(cat.category_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}