'use client';

import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/input/CategoryInput";
import Checkbox from "@/app/components/input/Checkbox";
import InputForm from "@/app/components/input/InputForm";
import SelectColor from "@/app/components/input/SelectColor";
import TextArea from "@/app/components/input/TextArea";
import { colors } from "@/app/utils/Colors";
import { categories } from "@/app/utils/ProductCategories";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "@/app/components/Button";
import toast from "react-hot-toast";
import { getDownloadURL, ref, getStorage, uploadBytesResumable } from "firebase/storage";
import firebaseApp from "@/libs/firebase";
import axios from "axios";
import { useRouter } from "next/navigation";

export type ImageType = {
    color: string;
    colorCode: string;
    image: File | null;
}

export type UploadedImageType = {
    color: string;
    colorCode: string;
    image: string;
}

const AddProductForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<ImageType[] | null>();
    const [isProductCreated, setIsProductCreated] = useState(false);
    const {register, handleSubmit, setValue, 
    watch, reset, formState:{errors}} = useForm<FieldValues>({
        defaultValues: {
            name: "",
            description: "",
            price: "", 
            brand: "", 
            category: "", 
            inStock: false, 
            images: []
        }
    });
    const category = watch("category");
    const setCustomValue = (id:string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    };

    useEffect(() => {
        setCustomValue("images", images);
    }, [images]);

    useEffect(() => {
        if (isProductCreated) {
            reset();
            setImages(null);
            setIsProductCreated(false);
        }
    }, [isProductCreated]);

    const addImageToState = useCallback((value: ImageType) => {
        setImages((previous) => {
            if(!previous) {
                return [value];
            }

            return [...previous, value];
        })
    }, []);

    const removeImageFromState = useCallback((value: ImageType) => {
        setImages((previous) => {
            if(previous) {
               const filteredImages = previous.filter(item => item.color != value.color);
                return filteredImages;
            }

            return previous;
        })
    }, []);

    const onSubmit: SubmitHandler<FieldValues> = async(data) => {
        setLoading(true);
        let uploadedImages: UploadedImageType[] = [];
        if(!data.category) {
            setLoading(false);
            return toast.error("Category is not selected!")
        }
        if(!data.images || data.images.length === 0) {
            setLoading(false);
            return toast.error("Image not selected!")
        }

        const handleImageUploads = async() => {
            toast("Creating product. Please wait...");
            try{
                for (const item of data.images) {
                    if(item.image) {
                        const fileName = new Date().getTime() + "-" + item.image.name;
                        const storage = getStorage(firebaseApp);
                        const storageRef = ref(storage, `products/${fileName}`);
                        const uploadTask = uploadBytesResumable(storageRef, item.image)

                        await new Promise<void>((resolve, reject) => {
                            uploadTask.on(
                                "state_changed",
                                (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    console.log('Upload is ' + progress + '% done');
                                    switch (snapshot.state) {
                                      case 'paused':
                                        console.log('Upload is paused');
                                        break;
                                      case 'running':
                                        console.log('Upload is running');
                                        break;
                                    }
                                },
                                (error) => {
                                    toast.error("Error Uploading Image");
                                    reject(error);
                                  }, 
                                  () => {
                                    // Handle successful uploads on complete
                                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                        uploadedImages.push({
                                            ...item,
                                            image: downloadURL
                                        });
                                        console.log("File available at", downloadURL)
                                        resolve();
                                    }).catch((error) => {
                                        toast.error("Error getting the downloadURL");
                                        reject(error);
                                    });
                                  }
                            )
                        })
                    }
                }
            } catch(error) {
                setLoading(false);
                toast.error("Error handling image uploads");
            }
        }

        await handleImageUploads();
        const productData = {...data, images: uploadedImages};
        axios.post("/api/product", productData).then(() => {
            toast.success("Product created successfully");
            setIsProductCreated(true);
            router.refresh();
        }).catch((error) => {
            toast.error("Something went wrong when saving product to db")
        }).finally(() => {
            setLoading(false);
        })
    }

    return(
        <div className="w-full relative">
            <Heading title="Add Product" center />
            <InputForm id="name" label="Name"
            disabled={loading} register={register}
            errors={errors} required />
            <InputForm id="price" label="Price"
            disabled={loading} register={register}
            errors={errors} type="number" required />
            <InputForm id="brand" label="Brand"
            disabled={loading} register={register}
            errors={errors} required />
            <TextArea id="description" label="Description"
            disabled={loading} register={register}
            errors={errors} required />
            <Checkbox id="inStock" register={register} label="Is product inStock?" />

            <div className="font-medium w-full mt-4">
                <div className="mb-2 font-semibold">Select a category:</div>
                <div className="grid grid-cols-2 md:grid-cols-3 max-h-[50vh] 
                gap-3 overflow-y-auto">
                    {categories.map((item) => {
                        if(item.label === 'All') {
                            return null;
                        }

                        return <div key={item.label} className="col-span">
                            <CategoryInput onClick={(category) => {
                                setCustomValue("category", category)}} 
                                selected={category === item.label}
                                label={item.label}
                                icon={item.icon}/>
                        </div>
                    })}
                </div>
            </div>

            <div className="w-full flex flex-col flex-wrap gap-4">
                <div>
                    <div className="font-bold mt-4">
                        Select the available product colors and upload their images</div>
                    <div className="text-sm">
                        You must upload an image for each of the color selected otherwise your 
                        color selected would be ignored.</div>
                </div>
                <div className="grid grid-cols-2 gap-3">{
                colors.map((item, index) => {
                    return <SelectColor key={index} item={item} 
                    addImageToState={addImageToState}
                    removeImageFromState={removeImageFromState}
                    isProductCreated={isProductCreated} />
                })}</div>
            </div>
            <Button label={loading ? "Loading..." : "Add Product"}
            onClick={handleSubmit(onSubmit)}/>
        </div>
    )
}

export default AddProductForm;