import LoginForm from "../../components/LoginForm/LoginForm";
import background from '../../assets/illustration-word.svg';

const LoginPage = () => {
    return (
        <>
            <LoginForm />
            <img src={background} alt="background" />
        </>
    );
};

export default LoginPage;