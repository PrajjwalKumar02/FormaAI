import React from "react";
import { useFormContext } from "react-hook-form";
import FieldWrapper from "./FieldWrapper";

const SelectField = ({ field }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <FieldWrapper
            id={field.id}
            label={field.label}
            required={field.required}
            description={field.description}
            error={errors[field.id]}
        >
            <select
                id={field.id}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all bg-white"
                {...register(field.id, field.validation || {})}
            >
                <option value="">
                    {field.placeholder || "Select an option"}
                </option>
                {field.options?.map((option) => (
                    <option
                        key={option.value || option}
                        value={option.value || option}
                    >
                        {option.label || option}
                    </option>
                ))}
            </select>
        </FieldWrapper>
    );
};

export default SelectField;
