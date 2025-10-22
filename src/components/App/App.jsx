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
                <Route path="/register" element={
                    <RestrictedRoute
                        redirectTo="/dictionary"
                        component={<RegisterPage />}
                    />
                } />
                <Route path="/login" element={
                    <RestrictedRoute
                        redirectTo="/dictionary"
                        component={<LoginPage />}
                    />
                } />
                <Route path="/dictionary" element={
                    <PrivateRoute
                        redirectTo="/register"
                        component={<DictionaryPage />}
                    />
                } />
                <Route path="/recommend" element={
                    <PrivateRoute
                        redirectTo="/register"
                        component={<RecommendPage />}
                    />
                } />
                <Route path="/training" element={
                    <PrivateRoute
                        redirectTo="/register"
                        component={<TrainingPage />}
                    />
                } />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default App;