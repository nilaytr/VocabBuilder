import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loader } from "../Loader/Loader";
import Header from "../Header/Header";
import css from "./Layout.module.css";

const Layout = () => {
    return (
        <>
            <header>
                <Header />
            </header>
            <div className={css.mainContainer}>
                <main>
                    <Suspense fallback={<Loader />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </>
    );
}

export default Layout;