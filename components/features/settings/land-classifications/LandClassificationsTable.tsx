"use client";

import { Edit2, Trash2, FileText } from "lucide-react";
import { LandClassification } from "@/types/settings";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface LandClassificationsTableProps {
  classifications: LandClassification[];
  isLoading: boolean;
  locale: string;
  onEdit: (classification: LandClassification) => void;
  onDelete: (classification: LandClassification) => void;
}

export default function LandClassificationsTable({
  classifications,
  isLoading,
  locale,
  onEdit,
  onDelete
}: LandClassificationsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (classifications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <FileText className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No classifications found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new land classification.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discount (%)
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {classifications.map((classification) => (
            <tr key={classification.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {classification.code}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {locale === 'ar' ? classification.nameAr : classification.nameEn}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {classification.discountPercent}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(classification)}
                  className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(classification)}
                  className="text-red-600 hover:text-red-900 inline-flex items-center"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
