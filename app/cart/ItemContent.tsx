'use client'

import { CartProductType } from "../product/[productId]/ProductDetails";
import { formatPrice } from "../utils/formatPrice";
import Link from "next/link";
import { truncateText } from "../utils/truncateText";
import Image from "next/image";
import SetQuantity from "../components/products/SetQuantity";
import { useCart } from "../components/hooks/useCart";

interface ItemContentProps {
    item: CartProductType;
}

const ItemContent: React.FC<ItemContentProps> = ({item}) => {

    const { handleRemoveProductFromCart, 
        handleCartQuantityIncrease, handleCartQuantityDecrease } = useCart();

    return <div className="grid grid-cols-5 text-xs
    md:text-sm gap-4 border-t-[1.5px]
    border-slate-400 py-4 items-center">
        <div className="col-span-2
        justify-self-start flex gap-2
        md:gap-4">
            <Link href={`/product/${item.id}`}>
            <div className="relative w-[80px] aspect-square">
                <Image src={item.selectedIMG.image} alt={item.name} fill
                className="object-contain" />
            </div>
            </Link>
            <div className="flex flex-col justify-between">
            <Link href={`/product/${item.id}`}>
                {truncateText(item.name)}
                </Link>
            <div>{item.selectedIMG.color}</div>
            <div className="w-[80px]">
                <button className="text-slate-600 underline" onClick={() => {
                    handleRemoveProductFromCart(item)
                }}>
                    Remove
                </button>
            </div>
            </div>
        </div>
        <div className="justify-self-center">{formatPrice(item.price)}</div>
        <div className="justify-self-center">
            <SetQuantity 
            cartCounter={true}
            cartProduct={item}
            handleQuantityDecrease={() => {
                handleCartQuantityDecrease(item)
            }}
            handleQuantityIncrease={() => {
                handleCartQuantityIncrease(item)
            }} />
        </div>
        <div className="justify-self-end font-semibold">
            {formatPrice(item.price * item.quantity)}
            </div>

    </div>
}

export default ItemContent;