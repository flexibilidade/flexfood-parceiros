import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navigation from "./_components/Navigation";
import Hero from "./_components/Hero";
import Features from "./_components/Features";
import HowItWorks from "./_components/HowItWorks";
import Testimonials from "./_components/Testimonials";
import CTA from "./_components/CTA";
import Footer from "./_components/Footer";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navigation session={session} />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
