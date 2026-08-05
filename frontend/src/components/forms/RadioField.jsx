import React from "react";
import { useFormContext } from "react-hook-form";
import FieldWrapper from "./FieldWrapper";

const RadioField = ({ field }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <FieldWrapper
            id={field.id}
            label={field.label}
            required={field.required}
            error={errors[field.id]}
        >
            <div className="space-y-2">
                {field.options?.map((option) => (
                    <label
                        key={option.value || option}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                    >
                        <input
                            type="radio"
                            value={option.value || option}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            {...register(field.id, field.validation || {})}
                        />
                        {option.label || option}
                    </label>
                ))}
            </div>
        </FieldWrapper>
    );
};

export default RadioField;
