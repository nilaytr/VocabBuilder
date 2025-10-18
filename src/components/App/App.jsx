import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Loader } from "../Loader/Loader";
import { useDispatch } from "react-redux";

const LoginPage = lazy(() => import('../../pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../../pages/RegisterPage/RegisterPage'));
const NotFoundPage = lazy(() => import('../../pages/NotFoundPage/NotFoundPage'));
const DictionaryPage = lazy(() => import('../../pages/DictionaryPage/DictionaryPage'));
const RecommendPage = lazy(() => import('../../pages/RecommendPage/RecommendPage'));
const TrainingPage = lazy(() => import('../../pages/TrainingPage/TrainingPage'));

function App() {
    const dispatch = useDispatch();


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