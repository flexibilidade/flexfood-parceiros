import Image from "next/image";
import { UtensilsCrossed, ShoppingCart } from "lucide-react";

export default function JoinUs() {
    return (
        <div className="px-[5%] my-20">
            <h1 className="text-gray-700 text-3xl font-bold mb-8">
                Venda mais com o <span className="text-primary">flexfood</span>
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="w-[48.5%] bg-white rounded-xl shadow-md flex flex-col overflow-hidden lg:w-full">
                    <div className="relative w-full h-[300px]">
                        <Image
                            src="/images/restaurant.jpeg"
                            alt="Restaurante"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="bg-primary flex gap-8 p-5">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                            <UtensilsCrossed className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <span className="text-gray-300 text-sm font-medium block">
                                flexfood para
                            </span>
                            <strong className="text-gray-100 text-xl font-medium block mt-1">
                                Restaurantes, Bebidas, Cafeteria e mais
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="w-[48.5%] bg-white rounded-xl shadow-md flex flex-col overflow-hidden lg:w-full">
                    <div className="relative w-full h-[300px]">
                        <Image
                            src="/images/market.jpeg"
                            alt="Mercado"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="bg-primary flex gap-8 p-5">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                            <ShoppingCart className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <span className="text-gray-300 text-sm font-medium block">
                                flexfood para
                            </span>
                            <strong className="text-gray-100 text-xl font-medium block mt-1 sm:text-base">
                                Mercado, Farmácia e mais
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
