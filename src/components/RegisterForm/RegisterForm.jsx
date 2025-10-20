import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { registerUser } from "../../redux/auth/operations";
import css from "./RegisterForm.module.css";

const RegisterForm = ({ onSuccess }) => {
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        name: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
        email: Yup.string().matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Invalid email adaress.").required("Required"),
        password: Yup.string().matches(/^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/, "Password must be 7 characters long, contain at least 6 letters and 1 number.").required("Required"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });
    
    const onSubmit = async (values) => {
        try {
            const result = await dispatch(registerUser(values));
            
            if (result.meta.requestStatus === "fulfilled") {
                alert("Registration successful!");
                onSuccess?.();
            } else {
                alert("Registration failed. Please check your details.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            alert("An unexpected error occurred. Please try again later.");
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div>
                <h1>Register</h1>
                <p>To start using our services, please fill out the registration form below. All fields are mandatory:</p>
                <form onSubmit={handleSubmit(onSubmit)}>  
                    <div className={css.inputRegister}>
                        <label htmlFor="name">Name</label>
                        <input
                            className={`${css.input} ${errors.name ? css.error : dirtyFields.name ? css.valid : ""}`}
                            id="name" {...register("name")} placeholder="Name" type="text"
                        />
                        {(dirtyFields.name || errors.name) && (
                            <div className={css.validationRegister}>
                                <span className={errors.name ? css.errorIcon : css.successIcon}>
                                    <img src={errors.name ? "/icons/error.svg" : "/icons/success.svg"} alt={errors.name ? "Error" : "Success"} />
                                </span>
                                <span className={errors.name ? css.errorMessage : css.successMessage}>
                                    {errors.name?.message || "Success name"}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className={css.inputRegister}>
                        <label htmlFor="email">Email</label>
                        <input
                            className={`${css.input} ${errors.email ? css.error : dirtyFields.email ? css.valid : ""}`}
                            id="email" {...register("email")} placeholder="Email" type="email"
                        />
                        {(dirtyFields.email || errors.email) && (
                            <div className={css.validationRegister}>
                                <span className={errors.email ? css.errorIcon : css.successIcon}>
                                    <img src={errors.email ? "/icons/error.svg" : "/icons/success.svg"} alt={errors.email ? "Error" : "Success"} />
                                </span>
                                <span className={errors.email ? css.errorMessage : css.successMessage}>
                                    {errors.email?.message || "Success email"}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className={css.inputRegister}>
                        <label htmlFor="password">Password</label>
                        <input
                            className={`${css.input} ${errors.password ? css.error : dirtyFields.password ? css.valid : ""}`}
                            id="password" {...register("password")} placeholder="Password" type={showPassword ? "text" : "password"}
                        />
                        <img onClick={togglePassword} src={showPassword ? "/icons/eye.svg" : "/icons/eye-off.svg"} alt="show" />
                        {(dirtyFields.password || errors.password) && (
                            <div className={css.validationRegister}>
                                <span className={errors.password ? css.errorIcon : css.successIcon}>
                                    <img src={errors.password ? "/icons/error.svg" : "/icons/success.svg"} alt={errors.password ? "Error" : "Success"} />
                                </span>
                                <span className={errors.password ? css.errorMessage : css.successMessage}>
                                    {errors.password?.message || "Success password"}
                                </span>
                            </div>
                        )}
                    </div>
                    <button className={css.registerButton} type="submit">Register</button>
                </form>
            </div>
        </>
    )
};

export default RegisterForm;