// Hook para obter informações do restaurante atual
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import api from '@/lib/api';

export interface CurrentPartner {
    id: string;
    name: string;
    description?: string;
    address: string;
    city: string;
    province: string;
    photo?: string;
    banner?: string;
    status: string;
    availability: string;
}

export function useCurrentPartner() {
    const { user } = useAuth();
    const [partner, setPartner] = useState<CurrentPartner | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPartner() {
            if (!user?.id) {
                setPartner(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/api/partners/profile/current');

                if (response.data.success) {
                    setPartner(response.data.data.partner);
                } else {
                    setError(response.data.message || 'Restaurante não encontrado');
                    setPartner(null);
                }
            } catch (error: any) {
                console.error('Erro ao buscar restaurante:', error);
                setError(error.response?.data?.message || 'Erro ao carregar restaurante');
                setPartner(null);
            } finally {
                setLoading(false);
            }
        }

        fetchPartner();
    }, [user?.id]);

    return {
        partner,
        loading,
        error,
    };
}