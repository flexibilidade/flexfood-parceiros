import api from "../api";

export interface PartnerProfile {
    id: string;
    name: string;
    description?: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    availability: "OPEN" | "CLOSED" | "BUSY";
    photoUrl?: string;
    bannerUrl?: string;
    latitude?: number | null;
    longitude?: number | null;
}

export interface UpdatePartnerProfileData {
    name?: string;
    description?: string;
    phone?: string;
    address?: string;
    city?: string;
    province?: string;
    availability?: "OPEN" | "CLOSED" | "BUSY";
    latitude?: number;
    longitude?: number;
}

export const partnerService = {
    /**
     * Get partner profile
     */
    getPartnerProfile: async (): Promise<PartnerProfile> => {
        const response = await api.get("/api/partners/profile");
        return response.data.partner;
    },

    /**
     * Update partner profile
     */
    updatePartnerProfile: async (
        data: UpdatePartnerProfileData
    ): Promise<PartnerProfile> => {
        const response = await api.put("/api/partners/profile", data);
        return response.data.partner;
    },

    /**
     * Update partner availability
     */
    updateAvailability: async (
        availability: "OPEN" | "CLOSED" | "BUSY"
    ): Promise<void> => {
        await api.patch("/api/partners/availability", { availability });
    },

    /**
     * Upload partner photo
     */
    uploadPartnerPhoto: async (file: File): Promise<{ photoUrl: string }> => {
        const formData = new FormData();
        formData.append("photo", file);

        const response = await api.post("/api/partners/profile/upload-photo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    /**
     * Upload partner banner
     */
    uploadPartnerBanner: async (file: File): Promise<{ bannerUrl: string }> => {
        const formData = new FormData();
        formData.append("banner", file);

        const response = await api.post("/api/partners/profile/upload-banner", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};
