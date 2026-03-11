"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { updateListing, getListing, UpdateListingRequest } from "@/lib/api/listings-update";
import { Save, MapPin, FileText, Image as ImageIcon, Tag } from "lucide-react";
import { useLookupData } from "@/lib/contexts/LookupDataContext";
import { FormDropdown } from "@/components/ui/forms/FormDropdown";
import { CityRegionDropdowns } from "@/components/ui/forms/CityRegionDropdowns";
import { createTypedDropdownHandler } from "@/lib/utils/formHelpers";
import { safeGetLookupArray } from "@/lib/api/lookup";

interface ListingFormData extends UpdateListingRequest { }

interface EditListingFormProps {
  listingId: string;
}

export default function EditListingForm({ listingId }: EditListingFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { lookupData, loading: lookupLoading, error: lookupError } = useLookupData();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<ListingFormData | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    // Load listing data
    loadListingData();
  }, [isAuthenticated, listingId]);

  const loadListingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const listingData = await getListing(listingId);
      setFormData(listingData);
    } catch (error: any) {
      console.error("Error loading listing:", error);
      
      // Extract error message from API response
      let errorMessage = "Failed to load listing data. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData) return;

    try {
      setSaving(true);
      setError(null);
      await updateListing(formData);
      setSuccess(true);
      router.push("/dashboard/listings");
    } catch (error: any) {
      console.error("Error updating listing:", error);
      
      // Extract error message from API response
      let errorMessage = "Failed to update listing. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ListingFormData, value: any) => {
    if (!formData) return;
    setFormData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  // Create typed dropdown handlers
  const createDropdownHandler = (field: keyof ListingFormData) =>
    createTypedDropdownHandler(field, handleInputChange);

  // Special handler for status changes to clear buyer fields when not sold
  const handleStatusChange = (statusId: number) => {
    handleInputChange("statusId", statusId);

    // If status is not "Sold" (we'll assume any status other than a specific "Sold" status)
    // Clear buyer-related fields to prevent validation errors
    // Note: You may need to adjust this logic based on your actual status values
    if (formData) {
      // Clear buyer fields when status changes (user can fill them if needed)
      handleInputChange("buyerId", null);
      handleInputChange("purchasedPrice", null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={loadListingData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg">No listing data found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-green-700 font-medium">Listing updated successfully! Redirecting...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-red-700 font-medium">{error}</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter listing title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (m²)
              </label>
              <input
                type="number"
                value={formData.area || ""}
                onChange={(e) => handleInputChange("area", Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (SAR)
              </label>
              <input
                type="number"
                value={formData.price || ""}
                onChange={(e) => handleInputChange("price", Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter price"
              />
            </div>

            {/* Replace Status ID input with dropdown */}
            <FormDropdown
              label="Status"
              value={formData.statusId}
              options={safeGetLookupArray(lookupData, 'landStatus')}
              onChange={handleStatusChange}
              placeholder="Select status"
              loading={lookupLoading}
              error={lookupError || undefined}
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps Link
              </label>
              <input
                type="url"
                value={formData.googleMapsLink || ""}
                onChange={(e) => handleInputChange("googleMapsLink", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Google Maps link"
              />
            </div>
          </div>

          {/* Replace City ID and Region ID inputs with dependent dropdowns */}
          <div className="mt-6">
            <CityRegionDropdowns
              cityId={formData.cityId}
              regionId={formData.regionId}
              onCityChange={createDropdownHandler("cityId")}
              onRegionChange={createDropdownHandler("regionId")}
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
            {/* Replace Land Type ID input with dropdown */}
            <FormDropdown
              label="Land Type"
              value={formData.landTypeId}
              options={safeGetLookupArray(lookupData, 'landTypes')}
              onChange={createDropdownHandler("landTypeId")}
              placeholder="Select land type"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            {/* Replace Land Facing ID input with dropdown */}
            <FormDropdown
              label="Land Facing"
              value={formData.landFacingId}
              options={safeGetLookupArray(lookupData, 'landFacing')}
              onChange={createDropdownHandler("landFacingId")}
              placeholder="Select land facing"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            {/* Replace Classification ID input with dropdown */}
            <FormDropdown
              label="Classification"
              value={formData.classificationId}
              options={[]} // Classification data might not be in the main lookup
              onChange={createDropdownHandler("classificationId")}
              placeholder="Select classification"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            {/* Replace Ownership Status ID input with dropdown */}
            <FormDropdown
              label="Ownership Status"
              value={formData.ownershipStatusId}
              options={safeGetLookupArray(lookupData, 'ownershipStatus')}
              onChange={createDropdownHandler("ownershipStatusId")}
              placeholder="Select ownership status"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            {/* Replace Deed Type ID input with dropdown */}
            <FormDropdown
              label="Deed Type"
              value={formData.deedTypeId}
              options={safeGetLookupArray(lookupData, 'deedTypes')}
              onChange={createDropdownHandler("deedTypeId")}
              placeholder="Select deed type"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            {/* Replace Neighbor Type ID input with dropdown */}
            <FormDropdown
              label="Neighbor Type"
              value={formData.neighborTypeId}
              options={safeGetLookupArray(lookupData, 'neighborTypes')}
              onChange={createDropdownHandler("neighborTypeId")}
              placeholder="Select neighbor type"
              loading={lookupLoading}
              error={lookupError || undefined}
            />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanatory Video URL
              </label>
              <input
                type="url"
                value={formData.explanatoryVideoUrl || ""}
                onChange={(e) => handleInputChange("explanatoryVideoUrl", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter video URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title Deed URL
              </label>
              <input
                type="url"
                value={formData.titleDeedUrl || ""}
                onChange={(e) => handleInputChange("titleDeedUrl", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter title deed URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                National ID Copy URL
              </label>
              <input
                type="url"
                value={formData.nationalIdCopyUrl || ""}
                onChange={(e) => handleInputChange("nationalIdCopyUrl", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter national ID copy URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Land Survey Report URL
              </label>
              <input
                type="url"
                value={formData.landSurveyReportUrl || ""}
                onChange={(e) => handleInputChange("landSurveyReportUrl", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter land survey report URL"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (comma-separated)
            </label>
            <input
              type="text"
              value={(formData.features || []).join(", ")}
              onChange={(e) => handleInputChange("features", e.target.value.split(", ").filter(f => f.trim()))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter features separated by commas"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs (comma-separated)
            </label>
            <input
              type="text"
              value={(formData.imageUrls || []).join(", ")}
              onChange={(e) => handleInputChange("imageUrls", e.target.value.split(", ").filter(url => url.trim()))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image URLs separated by commas"
            />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="number"
                value={formData.userId || ""}
                onChange={(e) => handleInputChange("userId", Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter user ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent ID
              </label>
              <input
                type="number"
                value={formData.agentId || ""}
                onChange={(e) => handleInputChange("agentId", Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter agent ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buyer ID
                <span className="text-xs text-gray-500 ml-1">(Only for sold listings)</span>
              </label>
              <input
                type="number"
                value={formData.buyerId || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange("buyerId", value === "" ? null : Number(value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter buyer ID (leave empty if not sold)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchased Price (SAR)
                <span className="text-xs text-gray-500 ml-1">(Only for sold listings)</span>
              </label>
              <input
                type="number"
                value={formData.purchasedPrice || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange("purchasedPrice", value === "" ? null : Number(value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter purchased price (leave empty if not sold)"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>
            <textarea
              value={formData.reason || ""}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter reason or notes"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}