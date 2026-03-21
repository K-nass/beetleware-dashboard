"use client";

import { useState } from "react";
import { X } from "lucide-react";
import SettingsTabs from "./SettingsTabs";
import LandClassificationsTab from "./land-classifications/LandClassificationsTab";
import CommissionOfferTab from "./commission-offer/CommissionOfferTab";
import CommunicationsTab from "./communications/CommunicationsTab";
import FaqTab from "./faq/FaqTab";

type SettingsTab = 'land-classifications' | 'commission-offers' | 'communications' | 'faq';

interface SettingsContentProps {
  initialLandClassifications: any[];
  initialCommissionOffer: any;
  initialCommunications: any;
  initialFaqs: any[];
}

export default function SettingsContent({
  initialLandClassifications,
  initialCommissionOffer,
  initialCommunications,
  initialFaqs
}: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('land-classifications');
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Configure platform rules and settings</p>
      </div>

      {/* Global Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <X className="h-6 w-6 text-red-500" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'land-classifications' && (
          <LandClassificationsTab initialData={initialLandClassifications} />
        )}
        {activeTab === 'commission-offers' && (
          <CommissionOfferTab initialData={initialCommissionOffer} />
        )}
        {activeTab === 'communications' && (
          <CommunicationsTab initialData={initialCommunications} />
        )}
        {activeTab === 'faq' && (
          <FaqTab initialData={initialFaqs} />
        )}
      </div>
    </div>
  );
}
