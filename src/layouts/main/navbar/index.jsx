import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SimpleBarReact from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import {
  Airplay,
  Image,
  Film,
  Wifi,
  Copy,
  Users,
  FileText,
  File,
  LogIn,
  Layers,
} from "feather-icons-react";

export default function Navbar() {
  const [manu, setManu] = useState("");
  const [subManu, setSubManu] = useState("");
  const location = useLocation();

  useEffect(() => {
    var current = location.pathname.substring(
      location.pathname.lastIndexOf("/") + 1
    );
    setManu(current);
    setSubManu(current);
  }, [location.pathname.substring(location.pathname.lastIndexOf("/") + 1)]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <nav id="sidebar" className="sidebar-wrapper">
      <div className="sidebar-content">
        <div className="sidebar-brand">
          <Link to="/index">
            <img
              src={'/images/logo/logo-dark.png'}
              height="24"
              className="block dark:hidden"
              alt=""
            />
            <img
              src={'/images/logo/logo-light.png'}
              height="24"
              className="hidden dark:block"
              alt=""
            />
          </Link>
        </div>
        <SimpleBarReact style={{ height: "calc(100% - 70px)" }}>
          <ul
            className="sidebar-menu border-t dark:border-white/10 border-gray-100"
            data-simplebar
            style={{ height: "calc(100% - 70px)" }}
          >
            <li className={["", "index"].includes(manu) ? "active" : ""}>
              <Link to="/index">
                <Airplay className="h-4 w-4 me-3" />
                Dashboard
              </Link>
            </li>

            <li
              className={`sidebar-dropdown ${
                ["explore", "item-detail", "upload-work"].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                to="#"
                onClick={(e) => {
                  setSubManu(subManu === "explore-item" ? "" : "explore-item");
                }}
              >
                <Image className="h-4 w-4 me-3" />
                Explore Items
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "explore",
                    "item-detail",
                    "upload-work",
                    "explore-item",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "explore" ? "active" : ""}>
                    <Link to="/explore">Explore</Link>
                  </li>
                  <li className={manu === "item-detail" ? "active" : ""}>
                    <Link to="/item-detail">Item Detail</Link>
                  </li>
                  <li className={manu === "upload-work" ? "active" : ""}>
                    <Link to="/upload-work">Upload Item</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className={manu === "auction" ? "active" : ""}>
              <Link to="/auction">
                <Film className="h-4 w-4 me-3" />
                Live Auction
              </Link>
            </li>

            <li className={manu === "wallet" ? "active" : ""}>
              <Link to="/wallet">
                <Wifi className="h-4 w-4 me-3" />
                Connect Wallet
              </Link>
            </li>

            <li className={manu === "collection" ? "active" : ""}>
              <Link to="/collection">
                <Copy className="h-4 w-4 me-3" />
                Collections
              </Link>
            </li>

            <li
              className={`sidebar-dropdown ${
                [
                  "creators",
                  "creator-profile",
                  "creator-profile-setting",
                  "become-creator",
                ].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                to="#"
                onClick={(e) => {
                  setSubManu(subManu === "creator-item" ? "" : "creator-item");
                }}
              >
                <Users className="h-4 w-4 me-3" />
                Creators
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "creators",
                    "creator-profile",
                    "creator-profile-setting",
                    "become-creator",
                    "creator-item",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "creators" ? "active" : ""}>
                    <Link to="/creators">Creators</Link>
                  </li>
                  <li className={manu === "creator-profile" ? "active" : ""}>
                    <Link to="/creator-profile">Profile</Link>
                  </li>
                  <li
                    className={
                      manu === "creator-profile-setting" ? "active" : ""
                    }
                  >
                    <Link to="/creator-profile-setting">Profile Setting</Link>
                  </li>
                  <li className={manu === "become-creator" ? "active" : ""}>
                    <Link to="/become-creator">Become Creator</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                ["blog", "blog-detail"].includes(manu) ? "active" : ""
              }`}
            >
              <Link
                to="#"
                onClick={(e) => {
                  setSubManu(subManu === "blog-item" ? "" : "blog-item");
                }}
              >
                <FileText className="h-4 w-4 me-3" />
                Blog
              </Link>
              <div
                className={`sidebar-submenu ${
                  ["blog", "blog-detail", "blog-item"].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "blog" ? "active" : ""}>
                    <Link to="/blog">Blogs</Link>
                  </li>
                  <li className={manu === "blog-detail" ? "active" : ""}>
                    <Link to="/blog-detail">Blog Detail</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                ["starter", "faqs", "privacy", "terms"].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                to="#"
                onClick={(e) => {
                  setSubManu(subManu === "page-item" ? "" : "page-item");
                }}
              >
                <File className="h-4 w-4 me-3" />
                Pages
              </Link>
              <div
                className={`sidebar-submenu ${
                  ["starter", "faqs", "privacy", "terms", "page-item"].includes(
                    subManu
                  )
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "starter" ? "active" : ""}>
                    <Link to="/starter">Starter</Link>
                  </li>
                  <li className={manu === "faqs" ? "active" : ""}>
                    <Link to="/faqs">FAQs</Link>
                  </li>
                  <li className={manu === "privacy" ? "active" : ""}>
                    <Link to="/privacy">Privacy Policy</Link>
                  </li>
                  <li className={manu === "terms" ? "active" : ""}>
                    <Link to="/terms">Term & Condition</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                [
                  "login",
                  "signup",
                  "signup-success",
                  "reset-password",
                  "lock-screen",
                ].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                to="#"
                onClick={(e) => {
                  setSubManu(subManu === "auth-item" ? "" : "auth-item");
                }}
              >
                <LogIn className="h-4 w-4 me-3" />
                Authentication
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "login",
                    "signup",
                    "signup-success",
                    "reset-password",
                    "lock-screen",
                    "auth-item",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "login" ? "active" : ""}>
                    <Link to="/login">Login</Link>
                  </li>
                  <li className={manu === "signup" ? "active" : ""}>
                    <Link to="/signup">Signup</Link>
                  </li>
                  <li className={manu === "signup-success" ? "active" : ""}>
                    <Link to="/signup-success">Signup Success</Link>
                  </li>
                  <li className={manu === "reset-password" ? "active" : ""}>
                    <Link to="/reset-password">Reset Password</Link>
                  </li>
                  <li className={manu === "lock-screen" ? "active" : ""}>
                    <Link to="/lock-screen">Lockscreen</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                ["comingsoon", "maintenance", "error", "thankyou"].includes(
                  manu
                )
                  ? "active"
                  : ""
              }`}
            >
              <Link
                to="#"
                onClick={(e) => {
                  setSubManu(subManu === "error-item" ? "" : "error-item");
                }}
              >
                <Layers className="h-4 w-4 me-3" />
                Miscellaneous
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "comingsoon",
                    "maintenance",
                    "error",
                    "thankyou",
                    "error-item",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "comingsoon" ? "active" : ""}>
                    <Link to="/comingsoon">Comingsoon</Link>
                  </li>
                  <li className={manu === "maintenance" ? "active" : ""}>
                    <Link to="/maintenance">Maintenance</Link>
                  </li>
                  <li className={manu === "error" ? "active" : ""}>
                    <Link to="/error">Error</Link>
                  </li>
                  <li className={manu === "thankyou" ? "active" : ""}>
                    <Link to="/thankyou">Thank You</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className="relative lg:mx-8 lg:mt-8 mx-6 mt-6 p-6 rounded-lg bg-gradient-to-b to-transparent from-gray-50 dark:from-slate-800 text-center">
              <span className="relative z-10">
                <img src={'/images/creator.png'} className="w-32 mx-auto" alt="" />
                <span className="text-lg font-semibold h5">Subscribe Now</span>

                <span className="text-slate-400 mt-3 mb-5 block">
                  Get one month free and subscribe to pro
                </span>

                <Link
                  to="https://1.envato.market/giglink-react"
                  target="_blank"
                  className="btn inline-block text-center bg-gray-100/5 hover:bg-gray-100 border-gray-100 dark:border-gray-100/5 hover:border-gray-100 text-slate-900 dark:text-white dark:hover:text-slate-900 rounded-md"
                >
                  Subscribe
                </Link>
              </span>
            </li>
          </ul>
        </SimpleBarReact>
      </div>
    </nav>
  );
}
