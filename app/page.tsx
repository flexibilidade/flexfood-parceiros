import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navigation from "./_components/Navigation";
import Hero from "./_components/Hero";
import JoinUs from "./_components/JoinUs";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <Navigation session={session} />
      <Hero />
      <JoinUs />
    </>
  );
}
