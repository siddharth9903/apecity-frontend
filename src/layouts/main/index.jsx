import { useState } from "react";
import Navbar from "./navbar";
import Topnav from "./topnav";
import Footer from "./footer";
import { Outlet } from "react-router-dom";

const Main = () => {
    const [toggle, setToggle] = useState(false);
    return (
        <>
            <div className={`page-wrapper  ${toggle ? "toggled" : ""}`}>
                {/* <Navbar /> */}
                <main className="page-content bg-gray-50 dark:bg-slate-800">
                    <Topnav toggle={toggle} setToggle={setToggle} />
                    <Outlet />
                    {/* <Footer /> */}
                </main>
            </div>
        </>
    )
}

export default Main;
