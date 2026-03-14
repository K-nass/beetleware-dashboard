"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { addListing, extractErrorMessage, AddListingRequest } from "@/lib/api/listings-add";
import { addListingSchema } from "@/lib/validation/schemas";
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
  const { lookupData, loading: lookupLoading, error: lookupError } = useLookupData();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik<AddListingFormData>({
    initialValues: initialFormData,
    validationSchema: addListingSchema,
    onSubmit: async (values) => {
      try {
        setError(null);

        const requestData: AddListingRequest = {
          ...values,
          area: values.area!,
          price: values.price!,
          cityId: values.cityId!,
          regionId: values.regionId!,
        };

        await addListing(requestData);
        setSuccess(true);

        setTimeout(() => {
          router.push("/dashboard/listings");
        }, 1500);
      } catch (error: any) {
        console.error("Error adding listing:", error);
        setError(extractErrorMessage(error));
      }
    },
  });

  const handleInputChange = (field: keyof AddListingFormData, value: any) => {
    formik.setFieldValue(field, value);
  };

  const createDropdownHandler = (field: keyof AddListingFormData) =>
    createTypedDropdownHandler(field, handleInputChange);

  const handleCancel = () => {
    router.push("/dashboard/listings");
  };

  return (
    <div className="space-y-8">
      <form onSubmit={formik.handleSubmit} className="space-y-8">
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
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                value={formik.values.area || ""}
                onChange={(e) => formik.setFieldValue("area", e.target.value ? Number(e.target.value) : null)}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.area && formik.errors.area ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter area"
                required
              />
              {formik.touched.area && formik.errors.area && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.area}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (SAR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formik.values.price || ""}
                onChange={(e) => formik.setFieldValue("price", e.target.value ? Number(e.target.value) : null)}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.price && formik.errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter price"
                required
              />
              {formik.touched.price && formik.errors.price && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.price}</p>
              )}
            </div>

            <FormDropdown
              label="Status"
              value={formik.values.statusId}
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
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                name="googleMapsLink"
                value={formik.values.googleMapsLink}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.googleMapsLink && formik.errors.googleMapsLink ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter Google Maps link"
              />
              {formik.touched.googleMapsLink && formik.errors.googleMapsLink && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.googleMapsLink}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <CityRegionDropdowns
              cityId={formik.values.cityId}
              regionId={formik.values.regionId}
              onCityChange={createDropdownHandler("cityId")}
              onRegionChange={createDropdownHandler("regionId")}
              required
            />
            {formik.touched.cityId && formik.errors.cityId && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.cityId}</p>
            )}
            {formik.touched.regionId && formik.errors.regionId && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.regionId}</p>
            )}
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
              value={formik.values.landTypeId}
              options={safeGetLookupArray(lookupData, 'landTypes')}
              onChange={createDropdownHandler("landTypeId")}
              placeholder="Select land type"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            <FormDropdown
              label="Land Facing"
              value={formik.values.landFacingId}
              options={safeGetLookupArray(lookupData, 'landFacing')}
              onChange={createDropdownHandler("landFacingId")}
              placeholder="Select land facing"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            <FormDropdown
              label="Classification"
              value={formik.values.classificationId}
              options={[]}
              onChange={createDropdownHandler("classificationId")}
              placeholder="Select classification"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            <FormDropdown
              label="Ownership Status"
              value={formik.values.ownershipStatusId}
              options={safeGetLookupArray(lookupData, 'ownershipStatus')}
              onChange={createDropdownHandler("ownershipStatusId")}
              placeholder="Select ownership status"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            <FormDropdown
              label="Deed Type"
              value={formik.values.deedTypeId}
              options={safeGetLookupArray(lookupData, 'deedTypes')}
              onChange={createDropdownHandler("deedTypeId")}
              placeholder="Select deed type"
              loading={lookupLoading}
              error={lookupError || undefined}
            />

            <FormDropdown
              label="Neighbor Type"
              value={formik.values.neighborTypeId}
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
                name="explanatoryVideoUrl"
                value={formik.values.explanatoryVideoUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.explanatoryVideoUrl && formik.errors.explanatoryVideoUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter video URL"
              />
              {formik.touched.explanatoryVideoUrl && formik.errors.explanatoryVideoUrl && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.explanatoryVideoUrl}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title Deed URL
              </label>
              <input
                type="url"
                name="titleDeedUrl"
                value={formik.values.titleDeedUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.titleDeedUrl && formik.errors.titleDeedUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter title deed URL"
              />
              {formik.touched.titleDeedUrl && formik.errors.titleDeedUrl && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.titleDeedUrl}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                National ID Copy URL
              </label>
              <input
                type="url"
                name="nationalIdCopyUrl"
                value={formik.values.nationalIdCopyUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.nationalIdCopyUrl && formik.errors.nationalIdCopyUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter national ID copy URL"
              />
              {formik.touched.nationalIdCopyUrl && formik.errors.nationalIdCopyUrl && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.nationalIdCopyUrl}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Land Survey Report URL
              </label>
              <input
                type="url"
                name="landSurveyReportUrl"
                value={formik.values.landSurveyReportUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.landSurveyReportUrl && formik.errors.landSurveyReportUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter land survey report URL"
              />
              {formik.touched.landSurveyReportUrl && formik.errors.landSurveyReportUrl && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.landSurveyReportUrl}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (comma-separated)
            </label>
            <input
              type="text"
              value={formik.values.features.join(", ")}
              onChange={(e) => formik.setFieldValue("features", e.target.value.split(",").map(f => f.trim()).filter(f => f))}
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
              value={formik.values.imageUrls.join(", ")}
              onChange={(e) => formik.setFieldValue("imageUrls", e.target.value.split(",").map(url => url.trim()).filter(url => url))}
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
                name="userId"
                value={formik.values.userId || ""}
                onChange={(e) => formik.setFieldValue("userId", e.target.value ? Number(e.target.value) : null)}
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
                name="agentId"
                value={formik.values.agentId || ""}
                onChange={(e) => formik.setFieldValue("agentId", e.target.value ? Number(e.target.value) : null)}
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
                name="buyerId"
                value={formik.values.buyerId || ""}
                onChange={(e) => formik.setFieldValue("buyerId", e.target.value ? Number(e.target.value) : null)}
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
                name="purchasedPrice"
                value={formik.values.purchasedPrice || ""}
                onChange={(e) => formik.setFieldValue("purchasedPrice", e.target.value ? Number(e.target.value) : null)}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formik.touched.purchasedPrice && formik.errors.purchasedPrice ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter purchased price (leave empty if not sold)"
              />
              {formik.touched.purchasedPrice && formik.errors.purchasedPrice && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.purchasedPrice}</p>
              )}
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
            disabled={formik.isSubmitting}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {formik.isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {formik.isSubmitting ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
