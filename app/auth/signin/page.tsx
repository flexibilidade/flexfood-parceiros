import { auth } from "@/lib/auth";
import SignInClient from "./signin-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/dashboard");
    }

    return <SignInClient />;
}
