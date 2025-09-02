"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const DynamicBar = dynamic(() => Promise.resolve(Bar), { ssr: false });

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function getDateRange(mode: string): [string, string] {
  const today = new Date();
  const end = formatDate(today);
  let start = new Date(today);

  if (mode === "monthly") {
    start.setMonth(today.getMonth() - 1);
  } else if (mode === "quarterly") {
    start.setMonth(today.getMonth() - 3);
  } else if (mode === "yearly") {
    start.setFullYear(today.getFullYear() - 1);
  }

  return [formatDate(start), end];
}

export default function AnalyticsPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [mode, setMode] = useState<"custom" | "monthly" | "quarterly" | "yearly">("custom");
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
    const today = formatDate(new Date());
    setStartDate(today);
    setEndDate(today);
  }, []);

  useEffect(() => {
    if (hasMounted && mode !== "custom") {
      const [start, end] = getDateRange(mode);
      setStartDate(start);
      setEndDate(end);
    }
  }, [mode, hasMounted]);

  const fetchReport = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        mode,
      });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/misreport?${qs.toString()}`);
      if (!res.ok) {
        const text = await res.text();
        console.error("Fetch report failed:", text);
        throw new Error("Failed to fetch report");
      }
      const data: ReportData = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMounted) {
      fetchReport();
    }
  }, [startDate, endDate, mode, hasMounted]);

  if (!hasMounted) return null;

  return (
    <main className="p-6 space-y-6">
      <section className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium">From</label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={mode !== "custom"} />
        </div>
        <div>
          <label className="block text-sm font-medium">To</label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={mode !== "custom"} />
        </div>
        <div>
          <label className="block text-sm font-medium">Mode</label>
          <Select onValueChange={(v) => setMode(v as any)} value={mode}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Custom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => {
            const qs = new URLSearchParams({
              start_date: startDate,
              end_date: endDate,
              mode,
            });
            window.open(`/analytics/print?${qs.toString()}`, "_blank");
          }}
          variant="default"
        >
          Generate Report
        </Button>
      </section>

      {loading || !report ? (
        <div className="text-center py-20">Loading report…</div>
      ) : (
        <>
          {/* Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {report.total_orders}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Gross Revenue</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                ₹{report.gross_revenue.toFixed(2)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customers Involved</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {report.active_customers}
              </CardContent>
            </Card>
          </section>

          <Separator />

{/* Category Sales + Top Products Side by Side */}
<section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  {/* Sales by Category */}
  <Card className="h-full">
    <CardHeader>
      <CardTitle>Sales by Category</CardTitle>
    </CardHeader>
    <CardContent>
      <DynamicBar
        data={{
          labels: report.category_sales.map((c) => c.category_name),
          datasets: [
            {
              label: "Orders",
              data: report.category_sales.map((c) => c.order_count),
              backgroundColor: "rgba(59, 130, 246, 0.5)",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
        }}
      />
    </CardContent>
  </Card>

  {/* Top 10 Products */}
  {/* Top 10 Products */}
<Card className="h-full">
  <CardHeader>
    <CardTitle>Top 10 Products</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    <ScrollArea className="h-64 px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Units Sold</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {report.top_products.slice(0, 10).map((p, index) => (
            <TableRow key={p.name}>
              <TableCell className="font-medium">
                {index + 1}. {p.name}
              </TableCell>
              <TableCell className="text-right">
                {p.sold_count.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  </CardContent>
</Card>


</section>


          <Separator className="my-4"/>

          {/* Feedback & Account Trends */}
          {/* Feedback + Delivery on left, Account Trends on right */}
<section className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="space-y-4">
    {/* Feedback Summary */}
    <Card>
      <CardHeader>
        <CardTitle>Feedback Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Avg. Product Rating:{" "}
          <strong>
            {Number(report.feedback_summary?.avg_product_rating ?? 0).toFixed(2)}
          </strong>{" "}
          ⭐
        </p>
        <p>
          Avg. DA Rating:{" "}
          <strong>
            {Number(report.feedback_summary?.avg_da_rating ?? 0).toFixed(2)}
          </strong>{" "}
          ⭐
        </p>
      </CardContent>
    </Card>

    {/* Delivery Success Rate */}
    <Card>
      <CardHeader>
        <CardTitle>Delivery Success Rate</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {report.delivery_success_rate.toFixed(2)}%
      </CardContent>
    </Card>
  </div>

  {/* Account Creation Trends */}
<Card className="h-64">
  <CardHeader>
    <CardTitle>Account Creations</CardTitle>
  </CardHeader>
  <CardContent className="h-44">
    <DynamicBar
      data={{
        labels: report.account_creation_trends.map((t) => t.date),
        datasets: [
          {
            label: "New Accounts",
            data: report.account_creation_trends.map((t) => t.count),
            backgroundColor: "rgba(16, 185, 129, 0.5)",
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 10,
              callback: function (value) {
                return Number.isInteger(value) ? value : "";
              },
            },
          },
        },
      }}
    />
  </CardContent>
</Card>

</section>

        </>
      )}
    </main>
  );
}
