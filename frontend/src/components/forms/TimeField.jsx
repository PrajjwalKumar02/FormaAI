import React from "react";
import { useFormContext } from "react-hook-form";
import FieldWrapper from "./FieldWrapper";

const TimeField = ({ field }) => {
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
            <input
                id={field.id}
                type="time"
                step={field.step || 60}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                {...register(field.id, field.validation || {})}
            />
        </FieldWrapper>
    );
};

export default TimeField;
