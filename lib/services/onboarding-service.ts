import api from "../api";

export interface OnboardingData {
    name: string;
    description?: string;
    phone: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    address: string;
    city: string;
    province: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    photo?: string;
    banner?: string;
}

export interface OnboardingResponse {
    message: string;
    partner: {
        id: string;
        name: string;
        email: string;
        status: string;
        availability: string;
    };
}

export const onboardingService = {
    /**
     * Complete partner onboarding
     */
    completeOnboarding: async (
        data: OnboardingData
    ): Promise<OnboardingResponse> => {
        const response = await api.post<OnboardingResponse>(
            "/api/partners/users/onboarding",
            data
        );
        return response.data;
    },
};
