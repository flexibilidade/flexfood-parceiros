// Página para gerenciar usuários do restaurante
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Mail, Shield, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { useCurrentPartner } from "@/hooks/use-current-partner";
import api from "@/lib/api";

interface PartnerUser {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    role: string;
    permissions: string[];
    isActive: boolean;
    invitedAt: string;
    acceptedAt?: string;
}

const ROLES = [
    { value: 'OWNER', label: 'Proprietário', description: 'Acesso total ao restaurante' },
    { value: 'MANAGER', label: 'Gerente', description: 'Acesso quase total, exceto levantamentos' },
    { value: 'STAFF', label: 'Funcionário', description: 'Acesso a pedidos e cardápio' },
    { value: 'VIEWER', label: 'Visualizador', description: 'Apenas visualização' },
];

const ROLE_COLORS = {
    OWNER: 'bg-red-100 text-red-800',
    MANAGER: 'bg-blue-100 text-blue-800',
    STAFF: 'bg-green-100 text-green-800',
    VIEWER: 'bg-gray-100 text-gray-800',
};

export default function UsersPage() {
    const { partner } = useCurrentPartner();
    const [users, setUsers] = useState<PartnerUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [creatingUser, setCreatingUser] = useState(false);
    const [inviteForm, setInviteForm] = useState({
        email: '',
        name: '',
        password: '',
        role: 'STAFF'
    });

    useEffect(() => {
        fetchUsers();
    }, [partner?.id]); // Adiciona partner.id como dependência

    const fetchUsers = async () => {
        if (!partner?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(`/api/partners/users/partner/${partner.id}/users`);

            if (response.data.success) {
                setUsers(response.data.data.users);
            } else {
                toast.error(response.data.message || 'Erro ao carregar usuários');
            }
        } catch (error: any) {
            console.error('Erro ao buscar usuários:', error);
            toast.error(error.response?.data?.message || 'Erro ao carregar usuários');
        } finally {
            setLoading(false);
        }
    };

    const handleInviteUser = async () => {
        if (!partner?.id) {
            toast.error('Restaurante não encontrado');
            return;
        }

        try {
            if (!inviteForm.email || !inviteForm.name || !inviteForm.password || !inviteForm.role) {
                toast.error('Todos os campos são obrigatórios');
                return;
            }

            setCreatingUser(true);
            const response = await api.post(`/api/partners/users/partner/${partner.id}/invite`, inviteForm);

            if (response.data.success) {
                toast.success('Usuário criado e adicionado com sucesso!');
                setInviteDialogOpen(false);
                setInviteForm({ email: '', name: '', password: '', role: 'STAFF' });
                fetchUsers();
            } else {
                toast.error(response.data.message || 'Erro ao criar usuário');
            }
        } catch (error: any) {
            console.error('Erro ao criar usuário:', error);
            toast.error(error.response?.data?.message || 'Erro ao criar usuário');
        } finally {
            setCreatingUser(false);
        }
    };

    const handleRemoveUser = async (userId: string) => {
        if (!partner?.id) {
            toast.error('Restaurante não encontrado');
            return;
        }

        try {
            const response = await api.delete(`/api/partners/users/partner/${partner.id}/users/${userId}`);

            if (response.data.success) {
                toast.success('Usuário removido com sucesso');
                fetchUsers();
            } else {
                toast.error(response.data.message || 'Erro ao remover usuário');
            }
        } catch (error: any) {
            console.error('Erro ao remover usuário:', error);
            toast.error(error.response?.data?.message || 'Erro ao remover usuário');
        }
    };

    const getRoleLabel = (role: string) => {
        return ROLES.find(r => r.value === role)?.label || role;
    };

    const getRoleColor = (role: string) => {
        return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Usuários do Restaurante</h1>
                    <p className="text-gray-600">Gerencie quem tem acesso ao seu restaurante</p>
                </div>

                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Criar Usuário
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Criar Novo Usuário</DialogTitle>
                            <DialogDescription>
                                Crie uma nova conta de usuário e adicione-a imediatamente ao seu restaurante.
                                O usuário terá acesso ao painel do restaurante com as permissões do papel selecionado.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="usuario@email.com"
                                    value={inviteForm.email}
                                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>

                            <div>
                                <Label htmlFor="name">Nome *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Nome completo do usuário"
                                    value={inviteForm.name}
                                    onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Senha *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Senha para a nova conta"
                                    value={inviteForm.password}
                                    onChange={(e) => setInviteForm(prev => ({ ...prev, password: e.target.value }))}
                                />
                            </div>

                            <div>
                                <Label htmlFor="role">Papel</Label>
                                <Select
                                    value={inviteForm.role}
                                    onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um papel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                <div>
                                                    <div className="font-medium">{role.label}</div>
                                                    <div className="text-sm text-gray-500">{role.description}</div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleInviteUser} disabled={creatingUser}>
                                {creatingUser ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Criando...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Criar Usuário
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter(u => u.isActive).length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Convites Pendentes</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter(u => !u.acceptedAt).length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Usuários</CardTitle>
                    <CardDescription>
                        Todos os usuários com acesso ao seu restaurante
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Papel</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Convidado em</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{user.user.name}</div>
                                            <div className="text-sm text-gray-500">{user.user.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getRoleColor(user.role)}>
                                            {getRoleLabel(user.role)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.acceptedAt ? (
                                            <Badge variant="default">Ativo</Badge>
                                        ) : (
                                            <Badge variant="secondary">Convite Pendente</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.invitedAt).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveUser(user.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}