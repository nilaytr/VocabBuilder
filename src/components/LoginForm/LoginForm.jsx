import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/auth/operations";
import css from "./LoginForm.module.css";

const RegisterForm = ({ onSuccess }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const validationSchema = Yup.object().shape({
        email: Yup.string().matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Invalid email address.").required("Required"),
        password: Yup.string().matches(/^(?=.*[a-zA-Z]{6})(?=.*\d)[a-zA-Z\d]{7}$/, "Password must contain at least 6 letters and 1 number.").required("Required"),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    });
    
    const onSubmit = async (values) => {
        try {
            const result = await dispatch(loginUser(values));
            
            if (result.meta.requestStatus === "fulfilled") {
                onSuccess?.();
            } else {
                alert("Login failed. Please check your details.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("An unexpected error occurred. Please try again later.");
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className={css.loginContainer}>
                <h1 className={css.titleForm}>Login</h1>
                <p className={css.textForm}>Please enter your login details to continue using our service:</p>
                <form className={css.loginForm} onSubmit={handleSubmit(onSubmit)}>
                    <div className={css.inputLogin}>
                        <label className={css.loginLabel} htmlFor="email">Email</label>
                        <input
                            className={`${css.input} ${errors.email ? css.error : dirtyFields.email ? css.valid : ""}`}
                            id="email" {...register("email")} placeholder="Email" type="email"
                        />
                        {(dirtyFields.email || errors.email) && (
                            <div className={css.validationLogin}>
                                <span className={errors.email ? css.errorIcon : css.successIcon}>
                                    <img src={errors.email ? "/icons/error.svg" : "/icons/success.svg"} alt={errors.email ? "Error" : "Success"} />
                                </span>
                                <span className={errors.email ? css.errorMessage : css.successMessage}>
                                    {errors.email?.message || "Success email"}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className={css.inputLogin}>
                        <label className={css.loginLabel} htmlFor="password">Password</label>
                        <input
                            className={`${css.input} ${errors.password ? css.error : dirtyFields.password ? css.valid : ""}`}
                            id="password" {...register("password")} placeholder="Password" type={showPassword ? "text" : "password"}
                        />
                        <img onClick={togglePassword} className={css.iconEye} src={showPassword ? "/icons/eye.svg" : "/icons/eye-off.svg"} alt="show" />
                        {(dirtyFields.password || errors.password) && (
                            <div className={css.validationLogin}>
                                <span className={errors.password ? css.errorIcon : css.successIcon}>
                                    <img src={errors.password ? "/icons/error.svg" : "/icons/success.svg"} alt={errors.password ? "Error" : "Success"} />
                                </span>
                                <span className={errors.password ? css.errorMessage : css.successMessage}>
                                    {errors.password?.message || "Success password"}
                                </span>
                            </div>
                        )}
                    </div>
                    <button className={css.loginButton} type="submit">Login</button>
                    <button className={css.register} type="button" onClick={() => navigate("/register")}>Register</button>
                </form>
            </div>
        </>
    )
};

export default RegisterForm;
