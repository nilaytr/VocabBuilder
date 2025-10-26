import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Loader } from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { refreshUser } from "../../redux/auth/operations";
import { selectIsRefreshing } from "../../redux/auth/selectors";
import PrivateRoute from "../../routes/PrivateRoute";
import RestrictedRoute from "../../routes/RestrictedRoute";

const LoginPage = lazy(() => import('../../pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../../pages/RegisterPage/RegisterPage'));
const NotFoundPage = lazy(() => import('../../pages/NotFoundPage/NotFoundPage'));
const DictionaryPage = lazy(() => import('../../pages/DictionaryPage/DictionaryPage'));
const RecommendPage = lazy(() => import('../../pages/RecommendPage/RecommendPage'));
const TrainingPage = lazy(() => import('../../pages/TrainingPage/TrainingPage'));
const Layout = lazy(() => import('../../components/Layout/Layout'));

function App() {
    const dispatch = useDispatch();
    const isRefreshing = useSelector(selectIsRefreshing);
    
    useEffect(() => {
        dispatch(refreshUser());
    }, [dispatch]);
    if (isRefreshing) {
        return <Loader />;
    }

    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="login" />} />
                    <Route path="/register" element={
                        <RestrictedRoute redirectTo="/dictionary">
                            <RegisterPage />
                        </RestrictedRoute>
                    } />
                    <Route path="/login" element={
                        <RestrictedRoute redirectTo="/dictionary">
                            <LoginPage />
                        </RestrictedRoute>
                    } />
                    <Route path="/dictionary" element={
                        <PrivateRoute redirectTo="/register">
                            <DictionaryPage />
                        </PrivateRoute>
                    } />
                    <Route path="/recommend" element={
                        <PrivateRoute redirectTo="/register">
                            <RecommendPage />
                        </PrivateRoute>
                    } />
                    <Route path="/training" element={
                        <PrivateRoute redirectTo="/register">
                            <TrainingPage />
                        </PrivateRoute>
                    } />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default App;