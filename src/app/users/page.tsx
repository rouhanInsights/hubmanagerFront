"use client";

import { useEffect, useState, Fragment } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useRouter } from "next/navigation";


import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Order {
  order_id: number;
  product_details: string | null;
  total_price: number;
  order_date: string;
}

interface Customer {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  address_orders: {
    [address: string]: Order[];
  };
}


export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchPin, setSearchPin] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Login required");
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customers/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data || []);
        setFilteredCustomers(data || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load customers");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSearch = (value: string) => {
    setSearchPin(value);
    const pin = value.trim().toLowerCase();

    if (pin === "") {
      setFilteredCustomers(customers);
    } else {
      const matched = customers.filter((cust) =>
        Object.keys(cust.address_orders).some((addr) => addr.toLowerCase().includes(pin))
      );
      setFilteredCustomers(matched);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <SidebarProvider>
    
      <SidebarInset>
        <header className="flex mb-4"></header>
        <div className="flex items-center gap-2 mb-4 px-4">
          <Search className="text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by Pincode or Address..."
            value={searchPin}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <main className="p-4 pt-0">
          {filteredCustomers.length === 0 ? (
            <p className="text-sm text-gray-500">No matching customers found.</p>
          ) : (
            filteredCustomers.map((cust) => (
              <Collapsible key={cust.user_id} className="mb-4 border rounded bg-white shadow transition-all duration-300">
                <CollapsibleTrigger asChild>
                  <button className="w-full flex justify-between items-center p-4 hover:bg-gray-100 transition-all group">
                    <div className="text-left space-y-1">
  <p className="text-lg font-semibold text-black">
    <span className="font-bold">User Name: </span> {cust.name}
  </p>
  <p className="text-sm text-gray-600">
    <span className="font-bold">Email: </span> {cust.email}
  </p>
  <p className="text-sm text-gray-600">
    <span className="font-bold">Phone no: </span> {cust.phone}
  </p>
  <p className="text-sm text-gray-600">
    <span className="font-bold">Account Created: </span>{" "}
    {new Date(cust.created_at).toLocaleDateString()}
  </p>
</div>

                    <ChevronDown className="text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="p-4 pt-0 space-y-4">
                  {Object.entries(cust.address_orders).map(([address, orders]) => (
                    <div key={address}>
                      <p className="text-sm font-semibold text-blue-600 mb-1">Address:  {address}</p>
                      <table className="w-full text-sm table-auto border border-gray-200 rounded">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1">Order ID</th>
                            <th className="px-2 py-1">Products</th>
                            <th className="px-2 py-1">Total</th>
                            <th className="px-2 py-1">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order, index) => {
                            const isExpanded = expandedOrders.includes(order.order_id);
                            const products = order.product_details?.split(",") || [];
                            const firstProduct = products[0];
                            const remainingProducts = products.slice(1);

                            return (
                              <Fragment key={`${order.order_id}-${index}`}>
                                <tr className="border-t">
                                  <td className="px-2 py-1 flex items-center gap-1">
                                    <button
                                      className="text-blue-600 text-sm"
                                      onClick={() =>
                                        setExpandedOrders((prev) =>
                                          isExpanded
                                            ? prev.filter((id) => id !== order.order_id)
                                            : [...prev, order.order_id]
                                        )
                                      }
                                    >
                                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                    #{order.order_id}
                                  </td>
                                  <td className="px-2 py-1 align-top">
                                    <div>{firstProduct}</div>
                                    {isExpanded && remainingProducts.length > 0 && (
                                      <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                                        {remainingProducts.map((item, idx) => (
                                          <li key={`${order.order_id}-${idx + 1}`}>{item.trim()}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </td>
                                  <td className="px-2 py-1 align-top">₹{order.total_price}</td>
                                  <td className="px-2 py-1 align-top">{new Date(order.order_date).toLocaleDateString()}</td>
                                </tr>
                              </Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
