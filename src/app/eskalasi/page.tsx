import React from "react";
import { Eskalasi } from "@/components/Eskalasi";
import issueData from "../../../data/issue.json";
import { type Issue } from "@/components/Eskalasi";

export default function EskalasiPage() {
  return (
    <main className="p-4 md:p-8 bg-slate-100 min-h-screen">
      <Eskalasi initialData={issueData as Issue[]} />
    </main>
  );
}