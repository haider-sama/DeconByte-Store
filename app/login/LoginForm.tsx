'use client';

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import InputForm from "../components/input/InputForm";
import { SubmitHandler, FieldValues, useForm } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";
import { AiOutlineGoogle } from "react-icons/ai";

interface LoginFormProps {
    currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({currentUser}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {register, handleSubmit, formState:{errors}} = useForm<FieldValues>({
        defaultValues: {
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
        signIn("credentials", {
            ...data,
            redirect: false
        }).then((callback) => {
            setIsLoading(false);
            if (callback?.ok) {
                router.push("/cart");
                router.refresh();
                toast.success("Welcome!");
            }
            if (callback?.error) {
                toast.error(callback.error)
            }

        })
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
        <Heading title="Login" />
        <hr className="bg-slate-400 w-full h-px" />
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

        <Button label={isLoading ? "Loading..." : "Login"} onClick={handleSubmit(onSubmit)}/>
        <p className="text-sm">Don't have an account?{" "}
        <Link className="underline" href={"/register"}>Register here</Link></p>
        </>
    );
}

export default LoginForm;