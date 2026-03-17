"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Land Classifications", segment: "classifications" },
  { label: "Commission & Offers", segment: "commission-offers" },
  { label: "Communications", segment: "communications" },
  { label: "FAQ Management", segment: "faq" },
];

export default function SettingsNav({ base }: { base: string }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Settings tabs">
        {tabs.map((tab) => {
          const href = `${base}/${tab.segment}`;
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={tab.segment}
              href={href}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
