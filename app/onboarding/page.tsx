import { auth } from "@/lib/auth";
import OnboardingClient from "./onboarding-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/signin");
    }

    return <OnboardingClient session={session} />;
}
