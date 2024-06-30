'use client';

import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

interface CheckboxProps {
    id: string;
    label: string;
    disabled?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
}

const Checkbox: React.FC<CheckboxProps> = ({
    id,
    label,
    disabled,
    required,
    register,
}) => {
    return <div className="w-full flex flex-row gap-2 items-center mt-4">
        <input type="checkbox"
        id={id}
        disabled={disabled}
        {...register(id)}
        placeholder=""
        className="cursor-pointer"/>
        <label htmlFor={id}
        className="font-medium cursor-pointer">{label}</label>
    </div>
}

export default Checkbox;