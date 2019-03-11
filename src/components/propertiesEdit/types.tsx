export interface FieldSet {
    id: string | null;
    appId: string | null,
    appProperty: string;
    value: string;
}

export interface PropertiesFormState {
    successMessage: string;
    validationMessage: string;
    code: number;
    errors: {
        code: number,
        internalMessage: string,
        moreInfo: string;
        userMessage: string;
    }[];
    formData: FieldSet[];
    properties: FieldSet[];

}