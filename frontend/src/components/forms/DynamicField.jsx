import React from "react";

import TextField from "./TextField";
import NumberField from "./NumberField";
import TextAreaField from "./TextAreaField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField"; 
import RadioField from "./RadioField";
import DateField from "./DateField";
import FileUploadField from "./FileUploadField"; 

const DynamicField = ({ field }) => {
    switch (field.type) {
        case "text":
            return <TextField field={field} />;
        case "number":
            return <NumberField field={field} />;
        case "textarea":
            return <TextAreaField field={field} />;
        case "select":
            return <SelectField field={field} />;
        case "checkbox":
            return <CheckboxField field={field} />;
        case "radio":
            return <RadioField field={field} />;
        case "date":
            return <DateField field={field} />;
        case "file":
            return <FileUploadField field={field} />;
        default:
            return null;
    }
};

export default DynamicField;
