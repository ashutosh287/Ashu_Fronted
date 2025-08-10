import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({

    email: Yup.string()
        .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format')
        .required('Email is required'),

    password: Yup.string()
        .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character')
        .required('Password is required'),
});

   