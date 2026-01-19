import api from "../api";

export interface Category {
    id: string;
    name: string;
    image?: string;
    imageUrl?: string;
    isAvailable: boolean;
    displayOrder: number;
    _count?: {
        products: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryData {
    name: string;
    image?: string;
}

export interface UpdateCategoryData {
    name?: string;
    image?: string;
    isAvailable?: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    photo?: string;
    imageUrl?: string;
    preparationTime: number;
    isAvailable: boolean;
    salesCount: number;
    menuCategoryId: string;
    menuCategory?: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductData {
    name: string;
    description: string;
    price: number;
    menuCategoryId: string;
    preparationTime: number;
    isAvailable?: boolean;
}

export interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    menuCategoryId?: string;
    preparationTime?: number;
    isAvailable?: boolean;
}

export const menuService = {
    // Categories
    createCategory: async (data: CreateCategoryData & { imageFile?: File }): Promise<{ message: string; category: Category }> => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.imageFile) {
            formData.append("image", data.imageFile);
        }

        const response = await api.post("/api/partners/menu/categories", formData);
        return response.data;
    },

    getCategories: async (): Promise<{ categories: Category[] }> => {
        const response = await api.get("/api/partners/menu/categories");
        return response.data;
    },

    updateCategory: async (
        id: string,
        data: UpdateCategoryData & { imageFile?: File }
    ): Promise<{ message: string; category: Category }> => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.isAvailable !== undefined) formData.append("isAvailable", String(data.isAvailable));
        if (data.imageFile) formData.append("image", data.imageFile);

        const response = await api.put(`/api/partners/menu/categories/${id}`, formData);
        return response.data;
    },

    deleteCategory: async (id: string): Promise<{ message: string }> => {
        const response = await api.delete(`/api/partners/menu/categories/${id}`);
        return response.data;
    },

    // Products
    createProduct: async (data: CreateProductData & { imageFile?: File }): Promise<{ message: string; product: Product }> => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("menuCategoryId", data.menuCategoryId);
        formData.append("preparationTime", String(data.preparationTime));
        formData.append("isAvailable", String(data.isAvailable ?? true));
        if (data.imageFile) {
            formData.append("image", data.imageFile);
        }

        const response = await api.post("/api/partners/menu/products", formData);
        return response.data;
    },

    getProducts: async (categoryId?: string): Promise<{ products: Product[] }> => {
        const params = categoryId ? { categoryId } : {};
        const response = await api.get("/api/partners/menu/products", { params });
        return response.data;
    },

    updateProduct: async (
        id: string,
        data: UpdateProductData & { imageFile?: File }
    ): Promise<{ message: string; product: Product }> => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.description) formData.append("description", data.description);
        if (data.price !== undefined) formData.append("price", String(data.price));
        if (data.menuCategoryId) formData.append("menuCategoryId", data.menuCategoryId);
        if (data.preparationTime !== undefined) formData.append("preparationTime", String(data.preparationTime));
        if (data.isAvailable !== undefined) formData.append("isAvailable", String(data.isAvailable));
        if (data.imageFile) formData.append("image", data.imageFile);

        const response = await api.put(`/api/partners/menu/products/${id}`, formData);
        return response.data;
    },

    deleteProduct: async (id: string): Promise<{ message: string }> => {
        const response = await api.delete(`/api/partners/menu/products/${id}`);
        return response.data;
    },
};
