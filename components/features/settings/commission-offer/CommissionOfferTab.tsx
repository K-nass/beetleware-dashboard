"use client";

import { useActionState } from "react";
import { CommissionOfferSettings } from "@/types/settings";
import {
  updateGlobalCommission,
  updateMinOffer,
  updateMaxOffer,
  updateCommissionSettings,
} from "@/app/actions/settings";
import CommissionOfferForm from "./CommissionOfferForm";

export default function CommissionOfferTab({
  initialData,
}: {
  initialData: CommissionOfferSettings | null;
}) {
  const [globalState, globalAction] = useActionState(updateGlobalCommission, null);
  const [minState, minAction] = useActionState(updateMinOffer, null);
  const [maxState, maxAction] = useActionState(updateMaxOffer, null);
  const [allState, allAction] = useActionState(updateCommissionSettings, null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Commission & Offer Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure commission rates and offer percentage limits
        </p>
      </div>

      {initialData && (
        <CommissionOfferForm
          initialData={initialData}
          globalAction={globalAction}
          globalState={globalState}
          minAction={minAction}
          minState={minState}
          maxAction={maxAction}
          maxState={maxState}
          allAction={allAction}
          allState={allState}
        />
      )}
    </div>
  );
}
