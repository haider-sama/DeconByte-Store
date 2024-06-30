'use client';

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import InputForm from "@/app/components/input/InputForm";
import { SafeUser } from "@/types";
import { Rating } from "@mui/material";
import { Order, Product, Review } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

interface AddRatingProps {
    product: Product & {
        reviews: Review[]
    };
    user: (SafeUser & {
        orders: Order[];
    }) | null;
}

const AddRating: React.FC<AddRatingProps> = ({product, user}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {register, handleSubmit, setValue, reset, formState: {errors}} = useForm<FieldValues>({
        defaultValues: {
            comment: "",
            rating: 0
        }
    });

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setLoading(true);
        try {
            if (data.rating === 0) {
                setLoading(false);
                return toast.error("No rating selected");
            }
    
            const ratingData = { ...data, userId: user?.id, product: product };
            const response = await axios.post("/api/rating", ratingData);
    
            if (response.status === 200) {
                toast.success("Rating added");
                router.refresh();
                reset();
            } else {
                toast.error("Oops! Something went wrong");
            }
        } catch (error) {
            toast.error("Oops! Something went wrong");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if(!user || !product) return null;


    const deliveredOrder = user?.orders.some(order => 
        order.products.find(item => item.id === product.id && 
            order.deliveryStatus === "delivered"));

    const userReview =  product?.reviews.find(((review: Review) => {
        return review.userId === user.id
    }));

    if(userReview || !deliveredOrder) return null;

    return(
        <div className="flex flex-col mt-24 gap-2 max-w-[500px]">
            <Heading title="Add a review" />
            <Rating onChange={(event, newValue) => {
                setCustomValue("rating", newValue);
            }}/>
            <InputForm id="comment" label="Comment" disabled={loading}
            register={register} errors={errors} required />
            <Button label={loading ? "Loading..." : "Review product"} 
            onClick={handleSubmit(onSubmit)} />
        </div>
    );
}

export default AddRating;