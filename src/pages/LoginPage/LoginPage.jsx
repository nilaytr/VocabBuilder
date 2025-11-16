import LoginForm from "../../components/LoginForm/LoginForm";
import background from '../../assets/illustration-word.svg';
import css from "./LoginPage.module.css";

const LoginPage = () => {
    return (
        <div className={css.loginPage}>
            <LoginForm />
            <img src={background} alt="background" className={css.background} />
        </div>
    );
};

export default LoginPage;