
import { auth } from "@/lib/auth";
import Navigation from "../_components/Navigation";
import { headers } from "next/headers";


    
    
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
  return (
    
      <div>
            <Navigation session={session} />
            {children}
    </div>
  );
}
