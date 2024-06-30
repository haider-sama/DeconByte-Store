'use client';

import { CartProductType, selectedIMGType } from "@/app/product/[productId]/ProductDetails";
import Image from "next/image";

interface ProductImagesProps {
    cartProduct: CartProductType;
    product: any;
    handleColorSelect: (value: selectedIMGType) => void;

}

const ProductImages: React.FC<ProductImagesProps> = ({
    cartProduct,
    product,
    handleColorSelect
}) => {
    return (
        <div className="grid grid-cols-6
        gap-2 h-full
        max-h-[500px]
        min-h-[300px]
        sm:min-h-[300px]">
            <div className="flex flex-col
            items-center justify-center gap-4
            cursor-pointer border h-full
            max-h-[500px]
            min-h-[300px]
            sm:min-h-[300px]">
                {product.images.map((image: selectedIMGType) => {
                    return (
                        <div key={image.color} onClick={() => {
                            handleColorSelect(image)
                        }} className={`aspect-square relative w-[80%] rounded border-slate-800
                        ${cartProduct.selectedIMG.color === 
                            image.color ? "border-[1.5px]" : "border-none"}
                        `}>
                            <Image src={image.image} alt={image.color} fill
                            className="object-contain"/>
                        </div>
                    )
                })}
            </div>
            <div className="col col-span-5 relative aspect-square">
                <Image fill src={cartProduct.selectedIMG.image}
                className="w-full h-full object-contain
                max-h-[500px]
                min-h-[300px]
                sm:min-h-[300px]" alt={cartProduct.name}/>
            </div>
        </div>
    );
}

export default ProductImages;
