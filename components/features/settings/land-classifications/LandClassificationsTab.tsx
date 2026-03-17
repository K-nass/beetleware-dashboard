"use client";

import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { LandClassification } from "@/types/settings";
import LandClassificationsTable from "./LandClassificationsTable";

export default function LandClassificationsTab({ initialData }: { initialData: LandClassification[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'en';

  const handleAdd = () => router.push(`${pathname}/add`);
  const handleEdit = (c: LandClassification) => router.push(`${pathname}/edit/${c.id}`);
  const handleDelete = (c: LandClassification) => router.push(`${pathname}/delete/${c.id}`);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Land Classifications</h2>
          <p className="mt-1 text-sm text-gray-500">Manage land classification types and discount percentages</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Classification
        </button>
      </div>

      <LandClassificationsTable
        classifications={initialData}
        isLoading={false}
        locale={locale}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
