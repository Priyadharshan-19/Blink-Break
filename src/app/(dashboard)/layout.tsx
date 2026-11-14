import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F5FF] text-[#14162E] dark:bg-[#111222] dark:text-white">
      <div className="mx-auto max-w-7xl p-6">{children}</div>
    </div>
  );
}
