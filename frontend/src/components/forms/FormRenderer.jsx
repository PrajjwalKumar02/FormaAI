import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import ConditionalRenderer from "./ConditionalRenderer";

const FormRenderer = ({ schema, onSubmit, defaultValues = {} }) => {
    const methods = useForm({
        defaultValues
    });

    if (!schema || !schema.fields) {
        return null;
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                {schema.fields.map((field) => (
                    <ConditionalRenderer
                        key={field.id}
                        field={field}
                    />
                ))}
                
                <div className="flex gap-3 pt-4">
                    <button 
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Submit
                    </button>
                    <button 
                        type="button"
                        onClick={() => methods.reset()}
                        className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default FormRenderer;
