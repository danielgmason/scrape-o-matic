import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from 'react';

export default function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <p>Welcome to your dashboard!</p>
      {/* Add more dashboard content here */}
    </div>
  );
}