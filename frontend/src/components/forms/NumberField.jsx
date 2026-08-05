import React from "react";
import { useFormContext } from "react-hook-form";
import FieldWrapper from "./FieldWrapper";

const NumberField = ({ field }) => {
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
                type="number"
                step={field.step || "any"}
                min={field.min}
                max={field.max}
                placeholder={field.placeholder || ""}
                {...register(field.id, {
                    ...field.validation,
                    setValueAs: (v) => v === "" ? undefined : Number(v)
                })}
            />
        </FieldWrapper>
    );
};

export default NumberField;
