import React from "react";
import { useNavigate } from "react-router";
import { useMediaQuery } from "react-responsive";
import { NavLink, Link } from "react-router-dom";

const UserFooter = ({ style }) => {
  const navigate = useNavigate();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  var colorMode = localStorage.getItem("color-theme");

  return (
    <div className={"footer dark:bg-slate-900"}>
      <div className="max-w-[1264px] mx-auto flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0">
        <Link to={"/"} className="flex items-center">
          <img
            className="object-contain w-20 h-20"
            src={`${window.location.origin}/images/logo.png`}
            alt="logo"
          />
          <h1 className="dark:text-[#fff] text-[#09080C] font-medium text-2xl">
            GiveStation
          </h1>
        </Link>
        <div>
          <ul className="flex items-center space-x-4">
            <li className="dark:text-[#fff] text-[#09080C] font-normal text-lg">
              <a href={"https://github.com/GiveStation"} target="_blank">
                {" "}
                Github{" "}
              </a>
            </li>
            <li className="dark:text-[#fff] text-[#09080C] font-normal text-lg">
              <a href={"https://t.me/GiveStation"} target="_blank">
                {" "}
                Telegram{" "}
              </a>
            </li>
            <li className="dark:text-[#fff] text-[#09080C] font-normal text-lg">
              <a href={"https://twitter.com/GiveStation"} target="_blank">
                {" "}
                Twitter{" "}
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center space-x-3 space-y-2 sm:space-y-0 sm:flex-row">
          <p className="dark:text-[#fff] text-[#09080C] font-normal text-xl">
            Want to be a partner?
          </p>
          <button className="bg-[#09C9E3] rounded-lg py-2 px-5 text-[#fff] font-semibold">
            <a href={"https://mailto:info@givestation.org"} target="_blank">
              {" "}
              Contact Us{" "}
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFooter;
