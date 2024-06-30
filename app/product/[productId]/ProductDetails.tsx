'use client';

import { Rating } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import SetColor from "@/app/components/products/SetColor";
import SetQuantity from "@/app/components/products/SetQuantity";
import Button from "@/app/components/Button";
import ProductImages from "@/app/components/products/ProductImages";
import { useCart } from "@/app/components/hooks/useCart";
import { MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";

interface ProductDetailsProps {
    product: any;
}

const HorizontalBar = () => {
    return <hr className="w-[50%] my-2" />
}

export type CartProductType = {
    id: string,
    name: string,
    description: string,
    category: string,
    brand: string,
    selectedIMG: selectedIMGType,
    quantity: number,
    price: number
}

export type selectedIMGType = {
    color: string,
    colorCode: string,
    image: string
}

const ProductDetails:React.FC<ProductDetailsProps> = ({product}) => {
    const { handleAddProductToCart, cartProducts } = useCart();
    const [isProductInCart, setIsProductInCart] = useState(false);
    const [cartProduct, setCartProduct] = useState<CartProductType>({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        selectedIMG: {...product.images[0]},
        quantity: 1,
        price: product.price,
    })
    const router = useRouter();

    useEffect(() => {
        setIsProductInCart(false);
        if (cartProducts) {
            const existingIndex = cartProducts.findIndex((item) => item.id === product.id);
        
        if (existingIndex > -1) {
            setIsProductInCart(true);
        }
    }
    }, [cartProducts])


    const handleColorSelect = useCallback((value: selectedIMGType) => {
        setCartProduct((previous) => {
            return { ...previous, selectedIMG: value};
        });
    }, [cartProduct.selectedIMG])


    const productRating = product.reviews.reduce((acc: number, item: any) =>
        item.rating + acc, 0) / product.reviews.length


        const handleQtyDecrease = useCallback(() => {
            if (cartProduct.quantity === 1) {
                return;
            }
            setCartProduct((previous) => {
                return { ...previous, quantity: previous.quantity - 1 };
            });
        }, [cartProduct]);


    const handleQtyIncrease = useCallback(() => {
        if(cartProduct.quantity === 99) {
            return;
        }
        setCartProduct((previous) => {
            return { ...previous, quantity: previous.quantity + 1};
        });
    }, [cartProduct])


    return <div className="grid grid-cols-1
    md:grid-cols-2 gap-12">
        <ProductImages cartProduct={cartProduct} product={product}
        handleColorSelect={handleColorSelect}/>
        <div className="flex flex-col gap-2 text-slate-700 text-sm">
            <h2 className="text-3xl font-medium text-black">{product.name}</h2>
            <div className="flex items-center gap-2">
                <Rating value={productRating} readOnly />
                <div>{product.reviews.length} Reviews</div>
            </div>
            <HorizontalBar />
            <div className="text-justify">{product.description}</div>
            <HorizontalBar />
            <div>
                <span className="font-semibold mr-2">CATEGORY:</span>
                {product.category}
            </div>
            <div>
                <span className="font-semibold mr-2">BRAND:</span>
                {product.brand}
            </div>
            <div className="font-semibold mr-6">
                AVAILABILITY: 
                <span className={`${product.inStock ? "text-green-400" : "text-red-600"} m-2`}>
                {product.inStock ? "In-Stock" : "Out of Stock"}</span>
            </div>
            <HorizontalBar />

            {isProductInCart ? ( 
            <>
            <p className="mb-2 text-slate-600 flex items-center gap-1">
                <MdCheckCircle className="text-green-400" size={24}/>
                <span>Product added to cart.</span>
            </p>
            <div className="max-w-[400px]">
                <Button label="View Cart" outline onClick={() => {
                    router.push("/cart");
                }} />
            </div>
                </> ) : ( <>
            <SetColor 
            cartProduct={cartProduct}
            images={product.images}
            handleColorSelect={handleColorSelect}/>
            <HorizontalBar />
            <SetQuantity 
            cartProduct={cartProduct}
            handleQuantityDecrease={handleQtyDecrease}
            handleQuantityIncrease={handleQtyIncrease}/>
            <HorizontalBar />
            <div className="max-w-[400px]">
            <Button  label="Add to cart" onClick={() => 
            {
                handleAddProductToCart(cartProduct)
            }}/>
            </div>
            </>)}
            
        </div>
    </div>
}

export default ProductDetails;