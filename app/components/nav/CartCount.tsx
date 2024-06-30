'use client';

import { useRouter } from "next/navigation";
import { useCart } from "../hooks/useCart";
import { CiShoppingCart } from "react-icons/ci";

const CartCount = () => {
    const { cartTotalQuantity } = useCart();
    const router = useRouter();

    return (
        <div className="relative cursor-pointer"
        onClick={() => {
            router.push("/cart");
        }}>
            <div className="text-3xl">
                <CiShoppingCart />
            </div>
            {cartTotalQuantity > 0 && (
            <span className="absolute top-[-10px] right-[-10px] 
                 bg-red-400 text-white h-6 w-6 rounded-full 
                 flex items-center justify-center text-sm">
                {cartTotalQuantity}
                </span>)}
        </div>
    )
}

export default CartCount;