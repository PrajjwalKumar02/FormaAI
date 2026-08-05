export { default as CheckboxField } from './CheckboxField';
export { default as ConditionalRenderer } from './ConditionalRenderer';
export { default as DateField } from './DateField';
export { default as DynamicField } from './DynamicField';
export { default as EmailField } from './EmailField';
export { default as FieldWrapper } from './FieldWrapper';
export { default as FileUploadField } from './FileUploadField';
export { default as FormRenderer } from './FormRenderer';
export { default as NumberField } from './NumberField';
export { default as PhoneField } from './PhoneField';
export { default as RadioField } from './RadioField';
export { default as SelectField } from './SelectField';
export { default as TextAreaField } from './TextAreaField';
export { default as TextField } from './TextField';
export { default as TimeField } from './TimeField';
export { default as UrlField } from './UrlField';

// Export field types mapping
export const FIELD_TYPES = {
    TEXT: 'text',
    TEXTAREA: 'textarea',
    NUMBER: 'number',
    SELECT: 'select',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    DATE: 'date',
    TIME: 'time',
    FILE: 'file',
    EMAIL: 'email',
    PHONE: 'phone',
    URL: 'url',
};

// Export field type to component mapping
export const FIELD_COMPONENTS = {
    text: 'TextField',
    textarea: 'TextAreaField',
    number: 'NumberField',
    select: 'SelectField',
    checkbox: 'CheckboxField',
    radio: 'RadioField',
    date: 'DateField',
    time: 'TimeField',
    file: 'FileUploadField',
    email: 'EmailField',
    phone: 'PhoneField',
    url: 'UrlField',
};

// Default export for convenience
const FormComponents = {
    CheckboxField,
    ConditionalRenderer,
    DateField,
    DynamicField,
    EmailField,
    FieldWrapper,
    FileUploadField,
    FormRenderer,
    NumberField,
    PhoneField,
    RadioField,
    SelectField,
    TextAreaField,
    TextField,
    TimeField,
    UrlField,
    FIELD_TYPES,
    FIELD_COMPONENTS
};

export default FormComponents;
