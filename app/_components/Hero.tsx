import Link from "next/link";

export default function Hero() {
    return (
        <div className="relative w-full bg-gradient-to-b from-black/50 to-black/70 bg-[url('/images/hero-bg.jpg')] bg-center bg-cover bg-no-repeat px-[5%]">
            <div className="max-w-[650px] mx-auto py-40 pt-48 flex flex-col justify-center items-center">
                <h1 className="text-xl text-white text-center font-bold lg:text-xl md:text-xl sm:text-xl xs:text-xl">
                    Gerencie o seu negócio com a nossa ajuda!
                </h1>

                <p className="text-gray-200 mt-6 px-[20%] text-center mb-10 text-sm md:px-[5%] sm:px-0 xs:text-sm">
                    Aumente suas vendas e alcance mais clientes com nossa plataforma.
                    Ferramentas completas para gerenciar pedidos, cardápio e muito mais.
                </p>

                <Link
                    href="/auth/signup"
                    className="inline-flex items-center justify-center text-sm font-bold leading-7 text-white rounded-md px-4 py-4 uppercase bg-primary hover:opacity-90 transition-all"
                >
                    GERENCIAR MEU NEGÓCIO
                </Link>
            </div>
        </div>
    );
}
