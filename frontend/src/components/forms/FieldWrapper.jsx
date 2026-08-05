import React from "react";

const FieldWrapper = ({
    id,
    label,
    required = false,
    error,
    children,
    description,
}) => {
    return (
        <div className="form-group space-y-1.5">
            {label && (
                <label 
                    htmlFor={id} 
                    className="form-label block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="required text-red-500 ml-1">*</span>}
                </label>
            )}

            {description && (
                <p className="form-description text-sm text-gray-500">
                    {description}
                </p>
            )}

            {children}

            {error && (
                <p className="form-error text-sm text-red-500">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default FieldWrapper;
