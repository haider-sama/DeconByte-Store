'use client';

import { formatPrice } from "@/app/utils/formatPrice";
import { truncateText } from "@/app/utils/truncateText";
import Image from "next/image";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";

interface ProductCartProps {
    data: any;
}

export const ProductCart:React.FC<ProductCartProps> = ({data}) => {

    const router = useRouter();

    const productRating = data.reviews.reduce((acc: number, item: any) =>
        item.rating + acc, 0) / data.reviews.length


    return (
        <div className="col-span-1 cursor-pointer
        border-[1px] border-gray-200 bg-slate-100
        rounded-sm p-2 transition 
        hover:scale-105
        text-center text-sm" onClick={() => router.push(`/product/${data.id}`)}>
            <div className="flex flex-col items-center w-full gap-1">
                <div className="aspect-square overflow-hidden relative w-full">
                    <Image 
                    fill
                    className="w-full h-full object-contain"
                    src={data.images[0].image}
                    alt={data.name}
                    />
                </div>
                <div className="mt-8">{truncateText(data.name)}</div>
                <div>
                    <Rating value={productRating} readOnly/>
                </div>
                <div>{data.reviews.length} Reviews</div>
                <div className="font-semibold">{formatPrice(data.price)}</div>
                <div></div>
            </div>
        </div>
    )
}