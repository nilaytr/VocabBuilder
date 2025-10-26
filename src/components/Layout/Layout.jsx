import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loader } from "../Loader/Loader";
import Header from "../Header/Header";

const Layout = () => {
    return (
        <>
            <header>
                <Header />
            </header>
            <div>
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