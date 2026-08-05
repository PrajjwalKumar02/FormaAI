import React from "react";
import { useFormContext } from "react-hook-form";
import FieldWrapper from "./FieldWrapper";

const CheckboxField = ({ field }) => {
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
            <div className="flex items-center gap-2">
                <input
                    id={field.id}
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...register(field.id, field.validation || {})}
                />
                <label htmlFor={field.id} className="text-sm text-gray-700">
                    {field.label}
                </label>
            </div>
        </FieldWrapper>
    );
};

export default CheckboxField;
