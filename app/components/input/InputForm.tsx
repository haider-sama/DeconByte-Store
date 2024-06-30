'use client';

import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

interface InputFormProps {
    id: string;
    label: string;
    type?: string;
    disabled?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
}

const InputForm: React.FC<InputFormProps> = ({
    id,
    label,
    type,
    disabled,
    required,
    register,
    errors
}) => {
    return <div className="w-full relative mt-4">
        <input 
        autoComplete="off"
        id={id}
        disabled={disabled}
        {...register(id, {required})}
        placeholder=""
        type={type}
        className={`peer w-full p-4 pt-6 outline-none
        bg-white font-light border-2 rounded-md
        transition disabled:opacity-70
        disabled:cursor-not-allowed
        ${errors[id] ? "border-red-400" : "border-slate-600"}
        ${errors[id] ? "focus:border-red-400" : "focus:border-slate-600"}
        `}/>
        <label htmlFor={id}
        className={`absolute
        cursor-text text-md duration-150 transform-translate-y-3
        top-5 z-10 origin-[0] left-4
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:translate-y-0
        peer-focus:scale-75
        peer-focus:-translate-y-4
        ${errors[id] ? "text-red-400" : "text-slate-600"}
        `}>{label}</label>
    </div>
}

export default InputForm;