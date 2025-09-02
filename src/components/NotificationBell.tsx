"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { io, Socket } from "socket.io-client";

type Notification = {
  order_id: number;
  user_id: number;
  total_price: number;
  order_date: string;
};

const CLEARED_KEY = "cleared_notifications";

export function NotificationBell() {
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnseen, setHasUnseen] = useState(false);
  const [readOrderIds, setReadOrderIds] = useState<Set<number>>(new Set());
  const [cleared, setCleared] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interactionAllowed = useRef<boolean>(false);
  const clearedOrderIdsRef = useRef<Set<number>>(new Set());

  // ✅ Build WebSocket URL dynamically based on environment
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001";
  const SOCKET_URL = base.replace(/^http/, typeof window !== "undefined" && window.location.protocol === "https:" ? "wss" : "ws");

  // ✅ Load cleared notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CLEARED_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as number[];
        clearedOrderIdsRef.current = new Set(parsed);
      } catch {
        console.error("⚠️ Failed to parse cleared IDs from storage");
      }
    }
  }, []);

  // ✅ Setup audio playback on click
  useEffect(() => {
    audioRef.current = new Audio("/notification.wav");

    const allowAudioPlayback = () => {
      console.log("🖱️ User clicked, audio unlocked.");
      interactionAllowed.current = true;
      document.removeEventListener("click", allowAudioPlayback);
    };

    document.addEventListener("click", allowAudioPlayback);
    return () => {
      document.removeEventListener("click", allowAudioPlayback);
    };
  }, []);

  const playNotificationSound = () => {
    if (interactionAllowed.current && audioRef.current) {
      audioRef.current.play().catch((err) =>
        console.error("🔇 Audio playback failed:", err)
      );
    }
  };

  // ✅ Setup WebSocket connection
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Connected to WebSocket");
    });

    socket.on("new_notification", (notif: Notification) => {
      if (clearedOrderIdsRef.current.has(notif.order_id)) return;

      toast.success(`🛒 New order received: #${notif.order_id}`);
      playNotificationSound();
      setNotifications((prev) => [notif, ...prev]);
      setHasUnseen(true);
    });

    socket.on("disconnect", () => {
      console.warn("❌ Disconnected from WebSocket");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
    setHasUnseen(false);
    setCleared(false);
  };

  const handleClearAll = () => {
    const ids = notifications.map((n) => n.order_id);
    ids.forEach((id) => clearedOrderIdsRef.current.add(id));
    localStorage.setItem(
      CLEARED_KEY,
      JSON.stringify(Array.from(clearedOrderIdsRef.current))
    );

    setNotifications([]);
    setReadOrderIds(new Set());
    setCleared(true);
  };

  return (
    <div className="z-50">
      <Button size="sm" onClick={handleOpenModal} className="text-sm relative">
        <Bell className="w-7 h-7 mr-2 text-white" />
        Notifications
        {hasUnseen && (
          <>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-ping" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full" />
          </>
        )}
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-grey bg-opacity-30 flex justify-center items-start pt-24 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">🔔 Recent Notifications</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearAll}
                  className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No notifications found.</p>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {notifications.slice(0, 20).map((notif) => (
                  <Link
                    key={notif.order_id}
                    href={`/assign?highlight=${notif.order_id}`}
                    onClick={() => {
                      setReadOrderIds((prev) => new Set(prev).add(notif.order_id));
                      setShowModal(false);
                    }}
                    className={`block border rounded p-2 text-sm transition hover:bg-blue-50 ${
                      readOrderIds.has(notif.order_id)
                        ? "bg-gray-100 text-gray-500"
                        : "bg-white text-black"
                    }`}
                  >
                    <div>
                      <strong>Order #{notif.order_id}</strong>
                    </div>
                    <div>User ID: {notif.user_id}</div>
                    <div>Total: ₹{notif.total_price}</div>
                    <div className="text-xs text-gray-500">
                      Date: {new Date(notif.order_date).toLocaleString()}
                    </div>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
