import { CartProductType } from "@/app/product/[productId]/ProductDetails";
import { createContext, useState, useContext, useCallback, useEffect } from "react";
import toast from "react-hot-toast";

type CartContextType = {
    cartTotalQuantity: number;
    cartTotalAmount: number;
    cartProducts: CartProductType[] | null;
    handleAddProductToCart: (product: CartProductType) => void;
    handleRemoveProductFromCart: (product: CartProductType) => void;
    handleCartQuantityIncrease: (product: CartProductType) => void;
    handleCartQuantityDecrease: (product: CartProductType) => void;
    handleClearCart: () => void;
    paymentIntent: string | null;
    handlePaymentIntent: (value: string | null) => void;
};


interface Props {
    [propName: string]: any;
}


export const CartContext = createContext<CartContextType | null>(null);


export const CartContextProvider = (props: Props) => {

    const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null);
    const [cartTotalQuantity, setCartTotalQuantity] = useState(0);
    const [cartTotalAmount, setCartTotalAmount] = useState(0);
    const [paymentIntent, setPaymentIntent] = useState<string | null>(null);


    useEffect(() => {
        const cartItems: any = localStorage.getItem("CartShopItems");
        const cProducts: CartProductType[] | null = JSON.parse(cartItems);
        const CartShopPaymentItem:any = localStorage.getItem("CartShopPaymentIntent");
        const paymentIntent: string | null = JSON.parse(CartShopPaymentItem);

        setCartProducts(cProducts);
        setPaymentIntent(paymentIntent);
    }, [])


    useEffect(() => {
        const getTotals = () => {
        if (cartProducts) {
                const { total, quantity } = cartProducts?.reduce((acc, item) => {
                    const itemTotal = ( item.price * item.quantity );
                    acc.total += itemTotal;
                    acc.quantity += item.quantity;
                    return acc
                }, {
                    total: 0,
                    quantity: 0
            });

            setCartTotalQuantity(quantity);
            setCartTotalAmount(total);
        }
    };
        getTotals();
    }, [cartProducts])


    const handleAddProductToCart = useCallback((product: CartProductType) => {
        setCartProducts((previous) => {
            let updatedCart;

            if (previous) {
                updatedCart = [ ...previous, product];
            } else {
                updatedCart = [product];
            }
            localStorage.setItem("CartShopItems", JSON.stringify(updatedCart));
            return updatedCart;
        });
    }, []);


    const handleRemoveProductFromCart = useCallback((product: CartProductType) => {
       if (cartProducts) {
            const filteredProducts = cartProducts.filter((item) => {
                return item.id != product.id
            })

            setCartProducts(filteredProducts)
          
        toast.success("Product removed")
        localStorage.setItem("CartShopItems", JSON.stringify(filteredProducts));
       }
    }, [cartProducts]);


    const handleCartQuantityIncrease = useCallback((product: CartProductType) => {
            let updatedCart;
            if(product.quantity === 99) {
                return toast.error("Oops! Maximum value reached.")
            }
            if(cartProducts) {
                updatedCart = [...cartProducts];
                const existingIndex = cartProducts.findIndex((item) => item.id === product.id);
            
            if (existingIndex > -1) {
                updatedCart[existingIndex].quantity = ( updatedCart[existingIndex].quantity + 1);
            }
            setCartProducts(updatedCart);
            localStorage.setItem("CartShopItems", JSON.stringify(updatedCart));
        }
    }, [cartProducts]
);


const handleCartQuantityDecrease = useCallback((product: CartProductType) => {
    let updatedCart;
    if(product.quantity === 1) {
        return toast.error("Oops! Minimum value reached.")
    }
    if(cartProducts) {
        updatedCart = [...cartProducts];
        const existingIndex = cartProducts.findIndex((item) => item.id === product.id);
    
    if (existingIndex > -1) {
        updatedCart[existingIndex].quantity = ( updatedCart[existingIndex].quantity - 1);
    }
    setCartProducts(updatedCart);
    localStorage.setItem("CartShopItems", JSON.stringify(updatedCart));
}
}, [cartProducts]
);


const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQuantity(0);
    toast.success("Cart cleared successfully");
    localStorage.setItem("CartShopItems", JSON.stringify(null));

}, [cartProducts]
);

const handlePaymentIntent = useCallback((value: string | null) => {
    setPaymentIntent(value);
    localStorage.setItem("CartShopPaymentIntent", JSON.stringify(value));

}, [paymentIntent]);


    const value = {
        cartTotalQuantity,
        cartTotalAmount,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleCartQuantityIncrease,
        handleCartQuantityDecrease,
        handleClearCart,
        paymentIntent,
        handlePaymentIntent
    };
    return <CartContext.Provider value={value} { ...props }/>
}


export const useCart = () => {
    const context = useContext(CartContext);
    if (context === null) {
        throw new Error("useCart must be used within a CartContextProvider")
    }

    return context;
}