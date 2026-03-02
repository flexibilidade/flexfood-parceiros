import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import EditProductClient from "./edit-product-client";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/signin");
    }

    const { id } = await params;

    return <EditProductClient session={session} productId={id} />;
}
