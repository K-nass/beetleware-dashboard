import { api } from './axios';

export interface UpdateListingRequest {
  id: number;
  userId: number;
  agentId: number;
  title: string;
  description: string;
  area: number;
  price: number;
  cityId: number;
  regionId: number;
  address: string;
  googleMapsLink: string;
  landTypeId: number;
  landFacingId: number;
  ownershipStatusId: number;
  deedTypeId: number;
  neighborTypeId: number;
  classificationId: number;
  features: string[];
  imageUrls: string[];
  explanatoryVideoUrl: string;
  titleDeedUrl: string;
  nationalIdCopyUrl: string;
  landSurveyReportUrl: string;
  statusId: number;
  reason: string;
  buyerId: number | null;
  purchasedPrice: number | null;
}

export const updateListing = async (data: UpdateListingRequest) => {
  try {
    const response = await api.post('/land/update', data);
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

export interface ListingResponse {
  statusCode: number;
  succeeded: boolean;
  message: string;
  errors: null;
  data: {
    id: number;
    userId: number;
    agentId: number;
    title: string;
    description: string;
    area: number;
    price: number;
    discountedPrice: number;
    discountPercent: number;
    cityId: number;
    cityName: string;
    regionId: number;
    regionName: string;
    address: string;
    googleMapsLink: string;
    landTypeId: number;
    landTypeName: string;
    landFacingId: number;
    landFacingName: string;
    ownershipStatusId: number;
    ownershipStatusName: string;
    deedTypeId: number;
    deedTypeName: string;
    neighborTypeId: number;
    neighborTypeName: string;
    features: string[];
    explanatoryVideoUrl: string;
    imageUrls: string[];
    titleDeedUrl: string;
    nationalIdCopyUrl: string;
    landSurveyReportUrl: string;
    isVerified: boolean;
    publishDate: string | null;
    statusId: number;
    statusName: string;
    isFavorite: boolean;
    viewCount: number;
    offerCount: number;
    pendingRequestsCount: number;
    classificationId: number;
    classificationName: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const getListing = async (id: string | number): Promise<UpdateListingRequest> => {
  try {
    const response = await api.get<ListingResponse>(`/land/${id}`);
    
    if (response.data.succeeded) {
      const listing = response.data.data;
      
      return {
        id: listing.id,
        userId: listing.userId,
        agentId: listing.agentId,
        title: listing.title,
        description: listing.description,
        area: listing.area,
        price: listing.price,
        cityId: listing.cityId,
        regionId: listing.regionId,
        address: listing.address,
        googleMapsLink: listing.googleMapsLink,
        landTypeId: listing.landTypeId,
        landFacingId: listing.landFacingId,
        ownershipStatusId: listing.ownershipStatusId,
        deedTypeId: listing.deedTypeId,
        neighborTypeId: listing.neighborTypeId,
        classificationId: listing.classificationId,
        features: listing.features,
        imageUrls: listing.imageUrls,
        explanatoryVideoUrl: listing.explanatoryVideoUrl,
        titleDeedUrl: listing.titleDeedUrl,
        nationalIdCopyUrl: listing.nationalIdCopyUrl,
        landSurveyReportUrl: listing.landSurveyReportUrl,
        statusId: listing.statusId,
        reason: "", // Not provided in GET response, keeping empty
        buyerId: null, // Not provided in GET response, keeping null
        purchasedPrice: null, // Not provided in GET response, keeping null
      };
    } else {
      throw new Error(response.data.message || 'Failed to fetch listing');
    }
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
};