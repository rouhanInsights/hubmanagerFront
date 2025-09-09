"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type ReportData = {
  period: { start_date: string; end_date: string; mode: string };
  total_orders: number;
  gross_revenue: number;
  active_customers: number;
  category_sales: { category_name: string; order_count: number }[];
  top_products: { name: string; sold_count: number }[];
  feedback_summary: { avg_product_rating: number; avg_da_rating: number };
  account_creation_trends: { date: string; count: number }[];
  order_statuses: { status: string; count: number }[];
  payment_modes: { payment_method: string; count: number }[];
  delivery_success_rate: number;
};

export default function PrintableMISReport() {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Pull primitive values once per change to the params object
  const { start_date, end_date, mode } = useMemo(() => {
    return {
      start_date: searchParams.get("start_date") ?? "",
      end_date: searchParams.get("end_date") ?? "",
      mode: searchParams.get("mode") ?? "custom",
    };
  }, [searchParams]);

  useEffect(() => {
    let isCancelled = false;

    async function fetchReport() {
      setLoading(true);
      try {
        const qs = new URLSearchParams({ start_date, end_date, mode });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/misreport?${qs.toString()}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch MIS report");
        }

        const data: ReportData = await res.json();
        if (!isCancelled) setReport(data);
      } catch (err) {
        console.error("MIS report fetch failed:", err);
        if (!isCancelled) setReport(null);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchReport();
    return () => {
      isCancelled = true;
    };
  }, [start_date, end_date, mode]);

  if (loading || !report) {
    return <div className="p-8">Loading MIS Report...</div>;
  }

  return (
    <main className="p-8 max-w-5xl mx-auto space-y-8 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">MIS Report</h1>
          <p className="text-muted-foreground">
            Period: {report.period.start_date} to {report.period.end_date}
          </p>
        </div>
        <Button onClick={() => window.print()} variant="default">
          Print Report
        </Button>
      </div>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold">Summary</h2>
        <ul className="list-disc ml-6 mt-2">
          <li>Total Orders: {report.total_orders}</li>
          <li>Gross Revenue: ₹{Number(report.gross_revenue ?? 0).toFixed(2)}</li>
          <li>Active Customers: {report.active_customers}</li>
          <li>
            Delivery Success Rate:{" "}
            {Number(report.delivery_success_rate ?? 0).toFixed(2)}%
          </li>
          <li>
            Avg. Product Rating:{" "}
            {Number(report.feedback_summary?.avg_product_rating ?? 0).toFixed(2)}
          </li>
          <li>
            Avg. DA Rating:{" "}
            {Number(report.feedback_summary?.avg_da_rating ?? 0).toFixed(2)}
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Sales by Category</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.category_sales.map((c) => (
              <TableRow key={c.category_name}>
                <TableCell>{c.category_name}</TableCell>
                <TableCell>{c.order_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Top 10 Products</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Units Sold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.top_products.map((p) => (
              <TableRow key={p.name}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.sold_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Account Creation Trends</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>New Accounts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.account_creation_trends.map((a) => (
              <TableRow key={a.date}>
                <TableCell>{a.date}</TableCell>
                <TableCell>{a.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Order Statuses</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.order_statuses.map((s) => (
              <TableRow key={s.status}>
                <TableCell>{s.status}</TableCell>
                <TableCell>{s.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Payment Modes</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Method</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.payment_modes.map((p) => (
              <TableRow key={p.payment_method}>
                <TableCell>{p.payment_method}</TableCell>
                <TableCell>{p.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
