'use client';

import { CartProductType, selectedIMGType } from "@/app/product/[productId]/ProductDetails";

interface SetColorProps {
    images: selectedIMGType[],
    cartProduct: CartProductType,
    handleColorSelect: (value: selectedIMGType) => void
}
const SetColor:React.FC<SetColorProps> = ({images, cartProduct, handleColorSelect}) => {
    return <div className="flex gap-4 items-center">
        <span className="font-semibold">COLOR: </span>
        <div className="flex gap-1">
            {images.map((image) => {
                return (
                    <div key={image.color} onClick={() => { 
                        handleColorSelect(image)
                    }}
                    className={`h-7 w-7 rounded-full border-green-400
                    flex items-center justify-center 
                    ${
                        cartProduct.selectedIMG.color === image.color ? "border-[1.5px]" : "border-none"}
                    `}>
                        <div style={{background: image.colorCode}} className="w-5 h-5
                        rounded-full border-[1px] border-slate-600
                        cursor-pointer"></div>
                    </div>
                );
            })}
        </div>
    </div>;
}

export default SetColor;