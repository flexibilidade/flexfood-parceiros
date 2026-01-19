import { auth } from "@/lib/auth";
import SignUpClient from "./signup-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/dashboard");
    }

    return <SignUpClient />;
}
