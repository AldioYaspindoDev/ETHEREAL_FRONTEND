"use client";
import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CatalogCards({ item }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div
      className={`flex flex-col bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition border border-blue-900 h-full`}
    >
      <Link href={`/catalog/${item._id}`} className="block flex-grow">
        {/* Gambar dengan tinggi responsif untuk keseimbangan mobile */}
        <div className="w-full h-[200px] sm:h-[240px] md:h-[280px] aspect-[3/4] overflow-hidden border-b border-blue-900">
          {item.productImages
            ?.filter((img) => img.isPrimary) // hanya ambil gambar primary
            .map((img) => (
              <Image
                key={img.publicId}
                src={img.url}
                width={80}
                height={80}
                alt={item.productName}
                className="object-cover w-full h-full"
              />
            ))}
        </div>

        <div className="px-3 py-2 sm:px-3 sm:py-2.5 flex flex-col text-left">
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg text-black mb-1 line-clamp-2">
            {item.productName}
          </h3>

          <div className="flex items-baseline gap-1">
            <p className="text-xs sm:text-sm text-[#011C83] font-medium">
              Rp
            </p>
            <p className="text-[#011C83] font-semibold text-sm sm:text-base md:text-lg">
              {item.productPrice?.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-3 pb-2 flex justify-between items-center gap-2">
        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-medium truncate">
          Stok: {item.stock}
        </p>

        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 font-medium truncate">
          {item.category}
        </p>
      </div>
    </div>
  );
}
