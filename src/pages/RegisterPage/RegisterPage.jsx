import RegisterForm from "../../components/RegisterForm/RegisterForm";
import background from '../../assets/illustration-word.svg';

const RegisterPage = () => {
    return (
        <>
            <RegisterForm />
            <img src={background} alt="background" />
        </>
    );
};

export default RegisterPage;