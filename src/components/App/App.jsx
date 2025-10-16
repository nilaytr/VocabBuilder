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