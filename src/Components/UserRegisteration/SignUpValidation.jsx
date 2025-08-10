import * as Yup from "yup";

export const SignUpSchema = Yup.object().shape({
    name: Yup.string().matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .required('Name is required'),

    email: Yup.string()
        .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format')
        .required('Email is required'),


    password: Yup.string()
        .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character')
        .required('Password is required'),

    
});