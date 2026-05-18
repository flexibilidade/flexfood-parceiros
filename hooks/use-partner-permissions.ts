// Hook para gerenciar permissões de usuários de restaurantes
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import api from '@/lib/api';

export interface PartnerUserPermissions {
    role: string;
    permissions: string[];
    isOwner: boolean;
    canManageWithdrawals: boolean;
    canManageUsers: boolean;
    canViewFinances: boolean;
    partnerId?: string;
    userId?: string;
}

export function usePartnerPermissions(partnerId?: string) {
    const { user } = useAuth();
    const [permissions, setPermissions] = useState<PartnerUserPermissions | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPermissions() {
            if (!user?.id || !partnerId) {
                setPermissions(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await api.get(`/api/partners/users/permissions/${partnerId}`);

                if (response.data.success) {
                    setPermissions(response.data.data);
                } else {
                    setError(response.data.message || 'Erro ao carregar permissões');
                    setPermissions(null);
                }
            } catch (error: any) {
                console.error('Erro ao buscar permissões:', error);
                setError(error.response?.data?.message || 'Erro ao carregar permissões');
                setPermissions(null);
            } finally {
                setLoading(false);
            }
        }

        fetchPermissions();
    }, [user?.id, partnerId]);

    const hasPermission = (permission: string): boolean => {
        return permissions?.permissions.includes(permission) || false;
    };

    const hasAnyPermission = (requiredPermissions: string[]): boolean => {
        if (!permissions) return false;
        return requiredPermissions.some(permission =>
            permissions.permissions.includes(permission)
        );
    };

    const hasAllPermissions = (requiredPermissions: string[]): boolean => {
        if (!permissions) return false;
        return requiredPermissions.every(permission =>
            permissions.permissions.includes(permission)
        );
    };

    return {
        permissions,
        loading,
        error,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    };
}