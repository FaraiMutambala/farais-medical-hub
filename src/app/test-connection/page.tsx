"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestConnection() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from("connection_test")
        .select("*")
        .limit(1);

      if (error && error.code === "42P01") {
        setStatus("Connected! The test table has not been created yet.");
      } else if (error) {
        setStatus(`Connection response: ${error.message}`);
      } else {
        setStatus("Connected successfully!");
      }
    }

    testConnection();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="rounded-2xl bg-white p-10 text-center shadow-md">
        <h1 className="text-2xl font-bold text-blue-950">
          Supabase Connection Test
        </h1>
        <p className="mt-5 text-slate-600">{status}</p>
      </div>
    </main>
  );
}