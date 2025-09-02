// import { useQuery } from "@tanstack/react-query";

// export function useNotifications() {
//   return useQuery({
//     queryKey: ["notifications"],
//     queryFn: async () => {
//       console.log("⏳ Fetching notifications...");
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notifications`);
//       const data = await res.json();
//       console.log("📥 Received:", data.notifications); // Add this
//       return data.notifications;
//     },
//     refetchInterval: 5000,
//   });
// }
