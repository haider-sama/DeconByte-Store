'use client';

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import InputForm from "../components/input/InputForm";
import { SubmitHandler, FieldValues, useForm } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGithub, AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

interface RegiserFormProps {
    currentUser: SafeUser | null;
}

const RegisterForm: React.FC<RegiserFormProps> = ({currentUser}) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {register, handleSubmit, formState:{errors}} = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });

    useEffect(() => {
        if (currentUser) {
            router.push("/cart");
            router.refresh();
        }
    }, [])

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios.post("/api/register", data).then(() => {
            toast.success("Account created successfully!");

            signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            }).then((callback) => {
                if (callback?.ok) {
                    router.push("/login");
                    router.refresh();
                    toast.success("Welcome!");
                }

                if (callback?.error) {
                    toast.error(callback.error)
                }
            });
        }).catch(() =>  toast.error("Oops! Something went wrong")).finally(() => {
            setIsLoading(false);
        });
    }

    if (currentUser) {
        return <p className="text-center">Logged in. Redirecting...</p>
    }

    return (
        <>
        <Heading title="Register" />
        <Button label="Google" outline
        icon={AiOutlineGoogle} onClick={() => {
            signIn("google");
        }} />
        <Button label="Github" outline
        icon={AiOutlineGithub} onClick={() => {

        }} />
        <hr className="bg-slate-400 w-full h-px" />
        <InputForm 
        id="name" 
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required/>
        <InputForm 
        id="email" 
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required/>
        <InputForm 
        id="password" 
        label="Password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"/>

        <Button label={isLoading ? "Loading..." : "Sign up"} onClick={handleSubmit(onSubmit)}/>
        <p className="text-sm">Already have an account?{" "}
        <Link className="underline" href={"/login"}>Login here</Link></p>
        </>
    );
}

export default RegisterForm;