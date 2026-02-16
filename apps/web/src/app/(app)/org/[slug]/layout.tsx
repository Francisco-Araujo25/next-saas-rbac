import { redirect } from "next/navigation";

import { isAuthenticated, getCurrentOrg } from "@/auth/auth";

import { Header } from "@/components/header";
import { Tabs } from "@/components/tabs";

export default async function OrgLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check authentication
  if (!await isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  // Get current org to validate it exists
  const currentOrg = await getCurrentOrg()
  if (!currentOrg) {
    redirect('/')
  }

  return (
    <div className="py-4 space-y-4">
      <Header />
      <Tabs />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        {children}
      </main>
    </div>
  );
}

