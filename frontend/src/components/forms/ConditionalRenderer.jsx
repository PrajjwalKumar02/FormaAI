import React from "react";
import { useFormContext } from "react-hook-form";
import DynamicField from "./DynamicField";

const ConditionalRenderer = ({ field }) => {
    const { watch } = useFormContext();

    // If no dependency, always show
    if (!field.dependsOn) {
        return <DynamicField field={field} />;
    }

    // Handle multiple conditions
    const checkCondition = () => {
        const dependsOn = field.dependsOn;
        
        // Single condition
        if (dependsOn.field && dependsOn.value !== undefined) {
            const dependencyValue = watch(dependsOn.field);
            if (dependsOn.operator === 'not') {
                return dependencyValue !== dependsOn.value;
            }
            return dependencyValue === dependsOn.value;
        }

        // Multiple conditions (AND logic)
        if (dependsOn.conditions && Array.isArray(dependsOn.conditions)) {
            return dependsOn.conditions.every(condition => {
                const value = watch(condition.field);
                if (condition.operator === 'not') {
                    return value !== condition.value;
                }
                return value === condition.value;
            });
        }

        return true;
    };

    const shouldShow = checkCondition();

    if (!shouldShow) {
        return null;
    }

    return <DynamicField field={field} />;
};

export default ConditionalRenderer;
