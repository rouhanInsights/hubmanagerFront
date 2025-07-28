"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

type Feedback = {
  feedback_id: number;
  order_id: number;
  rating_product: number;
  rating_da: number;
  comment_product: string;
  comment_da: string;
  feedback_date: string;
  customer_name: string;
  customer_phone: string;
  da_name: string | null;
};

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/feedback`)
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((err) => {
        console.error("Error fetching feedback:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[50px] w-full rounded-md" />
          ))}
        </div>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-500 text-center">No feedback found.</p>
      ) : (
        <ScrollArea className="rounded-md border max-h-[80vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Delivery Agent</TableHead>
                <TableHead>Product ⭐</TableHead>
                <TableHead>Product Comment</TableHead>
                <TableHead>DA ⭐</TableHead>
                <TableHead>DA Comment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbacks.map((f) => (
                <TableRow key={f.feedback_id}>
                  <TableCell className="font-medium">#{f.order_id}</TableCell>
                  <TableCell>{f.customer_name}</TableCell>
                  <TableCell>{f.customer_phone}</TableCell>
                  <TableCell>{f.da_name || "Not assigned"}</TableCell>
                  <TableCell>{f.rating_product} ⭐</TableCell>
                  <TableCell>{f.comment_product || "-"}</TableCell>
                  <TableCell>{f.rating_da} ⭐</TableCell>
                  <TableCell>{f.comment_da || "-"}</TableCell>
                  <TableCell>{new Date(f.feedback_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </main>
  );
}
