import RegisterForm from "../../components/RegisterForm/RegisterForm";
import background from '../../assets/illustration-word.svg';
import css from "./RegisterPage.module.css";

const RegisterPage = () => {
    return (
        <div>
            <RegisterForm />
            <img src={background} alt="background" className={css.background} />
        </div>
    );
};

export default RegisterPage;