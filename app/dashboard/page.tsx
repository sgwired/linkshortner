import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Link shortener dashboard",
};

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
