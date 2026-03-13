"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { addListing, extractErrorMessage, AddListingRequest } from "@/lib/api/listings-add";
import { Save, MapPin, FileText, Image as ImageIcon, Tag } from "lucide-react";
import { useLookupData } from "@/lib/contexts/LookupDataContext";
import { FormDropdown } from "@/components/ui/forms/FormDropdown";
import { CityRegionDropdowns } from "@/components/ui/forms/CityRegionDropdowns";
import { createTypedDropdownHandler } from "@/lib/utils/formHelpers";
import { safeGetLookupArray } from "@/lib/api/lookup";

interface AddListingFormData {
  userId: number | null;
  agentId: number | null;
  title: string;
  description: string;
  area: number | null;
  price: number | null;
  cityId: number | null;
  regionId: number | null;
  address: string;
  googleMapsLink: string;
  landTypeId: number | null;
  landFacingId: number | null;
  ownershipStatusId: number | null;
  deedTypeId: number | null;
  neighborTypeId: number | null;
  classificationId: number | null;
  features: string[];
  imageUrls: string[];
  explanatoryVideoUrl: string;
  titleDeedUrl: string;
  nationalIdCopyUrl: string;
  landSurveyReportUrl: string;
  statusId: number | null;
  buyerId: number | null;
  purchasedPrice: number | null;
}

const initialFormData: AddListingFormData = {
  userId: null,
  agentId: null,
  title: "",
  description: "",
  area: null,
  price: null,
  cityId: null,
  regionId: null,
  address: "",
  googleMapsLink: "",
  landTypeId: null,
  landFacingId: null,
  ownershipStatusId: null,
  deedTypeId: null,
  neighborTypeId: null,
  classificationId: null,
  features: [],
  imageUrls: [],
  explanatoryVideoUrl: "",
  titleDeedUrl: "",
  nationalIdCopyUrl: "",
  landSurveyReportUrl: "",
  statusId: null,
  buyerId: null,
  purchasedPrice: null,
};

export default function AddListingForm() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { lookupData, loading: lookupLoading, error: lookupError } = useLookupData();
  const [formData, setFormData] = useState<AddListingFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (field: keyof AddListingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createDropdownHandler = (field: keyof AddListingFormData) =>
    createTypedDropdownHandler(field, handleInputChange);

  const validateForm = (): boolean => {
    const requiredFields: { field: keyof AddListingFormData; label: string }[] = [
      { field: 'area', label: 'Area' },
      { field: 'price', label: 'Price' },
      { field: 'cityId', label: 'City' },
      { field: 'regionId', label: 'Region' }
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field]) {
        setError(`${label} is required`);
        return false;
      }
    }

    if (formData.area && formData.area <= 0) {
      setError('Area must be greater than 0');
      return false;
    }

    if (formData.price && formData.price <= 0) {
      setError('Price must be greater than 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const requestData: AddListingRequest = {
        ...formData,
        area: formData.area!,
        price: formData.price!,
        cityId: formData.cityId!,
        regionId: formData.regionId!,
      };

      await addListing(requestData);
      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/listings");
      }, 1500);
    } catch (error: any) {
      console.error("Error adding listing:", error);
      setError(extractErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/listings");
  };

  if (!isAuthenticated) {
    return null;
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
            <span className="text-green-700 font-medium">Listing created successfully! Redirecting...</span>
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
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
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
                value={formData.area || ""}
                onChange={(e) => handleInputChange("area", e.target.value ? Number(e.target.value) : null)}
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
                value={formData.price || ""}
                onChange={(e) => handleInputChange("price", e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter price"
                required
              />
            </div>

            <FormDropdown
              label="Status"
              value={formData.statusId}
              options={safeGetLookupArray(lookupData, 'landStatus')}
              onChange={createDropdownHandler("statusId")}
              placeholder="Select status"
              loading={lookupLoading}
              error={lookupError || undefined}
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
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
                value={formData.address}
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
                value={formData.googleMapsLink}
                onChange={(e) => handleInputChange("googleMapsLink", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Google Maps link"
              />
            </div>
          </div>

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
            <FormDropdown
              label="Land Type"
              value={formData.landTypeId}
              options={safeGetLookupArray(lookupData, 'landTypes')}
              onChange={createDropdownHandler("landTypeId")}
              placeholder="Select land type"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            <FormDropdown
              label="Land Facing"
              value={formData.landFacingId}
              options={safeGetLookupArray(lookupData, 'landFacing')}
              onChange={createDropdownHandler("landFacingId")}
              placeholder="Select land facing"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            <FormDropdown
              label="Classification"
              value={formData.classificationId}
              options={[]}
              onChange={createDropdownHandler("classificationId")}
              placeholder="Select classification"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            <FormDropdown
              label="Ownership Status"
              value={formData.ownershipStatusId}
              options={safeGetLookupArray(lookupData, 'ownershipStatus')}
              onChange={createDropdownHandler("ownershipStatusId")}
              placeholder="Select ownership status"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            <FormDropdown
              label="Deed Type"
              value={formData.deedTypeId}
              options={safeGetLookupArray(lookupData, 'deedTypes')}
              onChange={createDropdownHandler("deedTypeId")}
              placeholder="Select deed type"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

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
                value={formData.explanatoryVideoUrl}
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
                value={formData.titleDeedUrl}
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
                value={formData.nationalIdCopyUrl}
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
                value={formData.landSurveyReportUrl}
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
              value={formData.features.join(", ")}
              onChange={(e) => handleInputChange("features", e.target.value.split(",").map(f => f.trim()).filter(f => f))}
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
              value={formData.imageUrls.join(", ")}
              onChange={(e) => handleInputChange("imageUrls", e.target.value.split(",").map(url => url.trim()).filter(url => url))}
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
                onChange={(e) => handleInputChange("userId", e.target.value ? Number(e.target.value) : null)}
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
                onChange={(e) => handleInputChange("agentId", e.target.value ? Number(e.target.value) : null)}
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
                onChange={(e) => handleInputChange("buyerId", e.target.value ? Number(e.target.value) : null)}
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
                onChange={(e) => handleInputChange("purchasedPrice", e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter purchased price (leave empty if not sold)"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
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
            {saving ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
