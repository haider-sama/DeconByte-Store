'use client';

import { useCallback, useEffect, useState } from "react";
import { useCart } from "../components/hooks/useCart";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Button from "../components/Button";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CheckoutClient = () => {
    const {cartProducts, paymentIntent, handlePaymentIntent} = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [checkoutCompleted, setCheckoutCompleted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Create a payment intent as soon as the page loads
        if (cartProducts) {

            setLoading(true);
            setError(false);
    
            fetch("/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cartProducts,
                    payment_intent_id: paymentIntent
                })
            }).then((response) => {
                setLoading(false);
                if (response.status === 401) {
                    return router.push("/login");
                }
                return response.json();
            }).then((data) => {
                setClientSecret(data.paymentIntent.client_secret);
                handlePaymentIntent(data.paymentIntent.id);
            }).catch((error) => {
                setError(true);
                toast.error("Oops! Something went wrong");
            });
        }
    }, [cartProducts, paymentIntent, router, handlePaymentIntent]);


    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: "stripe",
            labels: "floating"
        },
    };


    const handlePaymentSuccess = useCallback((value: boolean) => {
        setPaymentSuccess(value);
        setCheckoutCompleted(true);
    }, [])


    return <div className="w-full">
        {clientSecret && cartProducts &&(
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm clientSecret={clientSecret} handlePaymentSuccess={
                handlePaymentSuccess}/>
            </Elements>
        )}

        {loading && <div className="text-center">Loading Checkout...</div>}
        {!cartProducts && <div className="text-center text-red-400">Oops! You don't have any
        products in your cart</div>}
        {paymentSuccess && 
        <div className="items-center flex flex-col gap-4">
            <div className="text-center text-green-400">Payment Successful</div>
            <div className="w-full max-w-[220px]"><Button label="View your Orders" onClick={() => { 
                router.push("/orders")}}/></div>
            </div>}
    </div>
}

export default CheckoutClient;
