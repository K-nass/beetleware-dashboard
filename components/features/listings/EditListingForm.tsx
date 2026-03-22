"use client";
import { updateListing } from "@/app/actions/listings";
import { MapPin, FileText, Image as ImageIcon, Tag, X } from "lucide-react";
import { FormDropdown } from "@/components/ui/forms/FormDropdown";
import { CityRegionDropdowns } from "@/components/ui/forms/CityRegionDropdowns";
import { SubmitButton } from "@/components/ui/forms/SubmitButton";
import { getLookUpDataByKey, LookupData } from "@/lib/api/lookup";
import { useActionState } from "react";

export interface ListingData {
  id: number;
  title?: string;
  description?: string;
  area?: number;
  price?: number;
  cityId?: number;
  regionId?: number;
  address?: string;
  googleMapsLink?: string;
  landTypeId?: number;
  landFacingId?: number;
  ownershipStatusId?: number;
  deedTypeId?: number;
  neighborTypeId?: number;
  classificationId?: number;
  features?: string[];
  imageUrls?: string[];
  explanatoryVideoUrl?: string;
  titleDeedUrl?: string;
  nationalIdCopyUrl?: string;
  landSurveyReportUrl?: string;
  statusId?: number;
  userId?: number;
  agentId?: number;
  buyerId?: number | null;
  purchasedPrice?: number | null;
  reason?: string;
}

interface EditListingFormProps {
  listing: ListingData;
  lookupData: LookupData;
}

export default function EditListingForm({ listing, lookupData }: EditListingFormProps) {
  const [state, formAction] = useActionState(updateListing, null);

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-8">
        <input type="hidden" name="id" value={listing.id} />

        {/* Error Message */}
        {state?.success === false && state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <X className="w-5 h-5 text-red-500" />
            <span className="font-medium">{state.error}</span>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={state?.fields?.title ?? listing.title ?? ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter listing title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="area"
                defaultValue={state?.fields?.area ?? listing.area ?? ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter area"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (SAR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                defaultValue={state?.fields?.price ?? listing.price ?? ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter price"
                required
              />
            </div>

            <FormDropdown
              label="Status"
              name="statusId"
               defaultValue={state?.fields?.statusId ?? listing.statusId}
              options={getLookUpDataByKey(lookupData, "landStatus")}
              placeholder="Select status"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              defaultValue={state?.fields?.description ?? listing.description ?? ""}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter listing description"
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                defaultValue={state?.fields?.address ?? listing.address ?? ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Link</label>
              <input
                type="url"
                name="googleMapsLink"
                defaultValue={state?.fields?.googleMapsLink ?? listing.googleMapsLink ?? ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Google Maps link"
              />
            </div>
          </div>

          <div className="mt-6">
            <CityRegionDropdowns
              cities={getLookUpDataByKey(lookupData, "cities")}
              initialCityId={state?.fields?.cityId ?? listing.cityId}
              initialRegionId={state?.fields?.regionId ?? listing.regionId}
              required
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Property Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormDropdown label="Land Type" name="landTypeId" defaultValue={state?.fields?.landTypeId ?? listing.landTypeId} options={getLookUpDataByKey(lookupData, "landTypes")} placeholder="Select land type" />
            <FormDropdown label="Land Facing" name="landFacingId" defaultValue={state?.fields?.landFacingId ?? listing.landFacingId} options={getLookUpDataByKey(lookupData, "landFacing")} placeholder="Select land facing" />
            <FormDropdown label="Classification" name="classificationId" defaultValue={state?.fields?.classificationId ?? listing.classificationId} options={getLookUpDataByKey(lookupData, "landClassifications")} placeholder="Select classification" />
            <FormDropdown label="Ownership Status" name="ownershipStatusId" defaultValue={state?.fields?.ownershipStatusId ?? listing.ownershipStatusId} options={getLookUpDataByKey(lookupData, "ownershipStatus")} placeholder="Select ownership status" />
            <FormDropdown label="Deed Type" name="deedTypeId" defaultValue={state?.fields?.deedTypeId ?? listing.deedTypeId} options={getLookUpDataByKey(lookupData, "deedTypes")} placeholder="Select deed type" />
            <FormDropdown label="Neighbor Type" name="neighborTypeId" defaultValue={state?.fields?.neighborTypeId ?? listing.neighborTypeId} options={getLookUpDataByKey(lookupData, "neighborTypes")} placeholder="Select neighbor type" />
          </div>
        </div>

        {/* Media & Documents */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Media & Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Explanatory Video URL</label>
              <input type="url" name="explanatoryVideoUrl" defaultValue={state?.fields?.explanatoryVideoUrl ?? listing.explanatoryVideoUrl ?? ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter video URL" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title Deed URL</label>
              <input type="url" name="titleDeedUrl" defaultValue={state?.fields?.titleDeedUrl ?? listing.titleDeedUrl ?? ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter title deed URL" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">National ID Copy URL</label>
              <input type="url" name="nationalIdCopyUrl" defaultValue={state?.fields?.nationalIdCopyUrl ?? listing.nationalIdCopyUrl ?? ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter national ID copy URL" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Land Survey Report URL</label>
              <input type="url" name="landSurveyReportUrl" defaultValue={state?.fields?.landSurveyReportUrl ?? listing.landSurveyReportUrl ?? ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter land survey report URL" />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
            <input type="text" name="features" defaultValue={state?.fields?.features ?? (listing.features ?? []).join(", ")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter features separated by commas" />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (comma-separated)</label>
            <input type="text" name="imageUrls" defaultValue={state?.fields?.imageUrls ?? (listing.imageUrls ?? []).join(", ")} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter image URLs separated by commas" />
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Additional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input type="number" name="userId" defaultValue={listing.userId ?? ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter user ID" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agent ID</label>
              <input type="number" name="agentId" defaultValue={listing.agentId ?? ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter agent ID" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buyer ID <span className="text-xs text-gray-500 ml-1">(Only for sold listings)</span>
              </label>
              <input type="number" name="buyerId" defaultValue={listing.buyerId ?? ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter buyer ID (leave empty if not sold)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchased Price (SAR) <span className="text-xs text-gray-500 ml-1">(Only for sold listings)</span>
              </label>
              <input type="number" name="purchasedPrice" defaultValue={listing.purchasedPrice ?? ""} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter purchased price (leave empty if not sold)" />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <textarea
              name="reason"
              defaultValue={listing.reason ?? ""}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter reason or notes"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <a href="/dashboard/listings" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </a>
          <SubmitButton label="Save Changes" pendingLabel="Saving..." />
        </div>
      </form>
    </div>
  );
}
