"use client";

import { Tag, MapPin, Edit, RefreshCw, Percent, DollarSign } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ListingCardProps {
  id: string;
  title: string;
  location: string;
  district: string;
  area: number;
  type: string;
  originalPrice: number;
  currentPrice: number;
  discount?: number;
  agent: string;
  status: "pending" | "approved" | "rejected";
  classification: string;
  image: string;
}

export default function ListingCard({
  id,
  title,
  location,
  district,
  area,
  type,
  originalPrice,
  currentPrice,
  discount,
  agent,
  status,
  classification,
  image,
}: ListingCardProps) {
  const router = useRouter();
  const handleEditClick = () => {
    router.push(`/dashboard/listings/edit/${id}`);
  };

  const handleClassifyClick = () => {
    router.push(`/dashboard/listings/classify/${id}`);
  };

  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-SA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow max-w-md">
      {/* Image Section */}
      <div className="relative h-40 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        
        {/* Classification Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{classification}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-5 py-2 rounded-full text-sm font-semibold capitalize ${statusColors[status]} shadow-sm`}>
            {status}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-3">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin className="w-5 h-5" />
          <span className="text-base">{location}, {district}</span>
        </div>

        {/* Area & Type */}
        <div className="flex items-center gap-2 text-gray-400">
          <Tag className="w-5 h-5" />
          <span className="text-base">{area} m² • {type}</span>
        </div>

        {/* Pricing */}
        <div className="space-y-0.5 pt-2">
          {discount && discount > 0 && (
            <p className="text-gray-400 line-through text-base">
              {formatPrice(originalPrice)} SAR
            </p>
          )}
          <p className="text-xl font-bold text-blue-500">
            {formatPrice(currentPrice)} SAR
          </p>
          {discount && discount > 0 && (
            <p className="text-green-500 font-semibold text-base">
              {discount}% Discount
            </p>
          )}
        </div>

        {/* Agent */}
        <p className="text-gray-500 text-base pt-2">
          Agent: <span className="text-gray-600">{agent}</span>
        </p>

        {/* Request Status */}
        {status === "pending" && (
          <div className="pt-3">
            <button className="w-full bg-cyan-100 text-cyan-600 py-3 rounded-xl text-base font-semibold flex items-center justify-center gap-2 hover:bg-cyan-200 transition-colors">
              <DollarSign className="w-5 h-5" />
              Pending Request
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button 
            onClick={handleEditClick}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Edit className="w-6 h-6" />
          </button>
          <button className="p-2 text-green-500 hover:text-green-600 transition-colors">
            <RefreshCw className="w-6 h-6" />
          </button>
          <button 
            onClick={handleClassifyClick}
            className="p-2 text-purple-500 hover:text-purple-600 transition-colors"
          >
            <Percent className="w-6 h-6" />
          </button>
          <button className="p-2 text-cyan-500 hover:text-cyan-700 transition-colors">
            <DollarSign className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
