import { useState } from "react";
import { Link } from "react-router-dom";
import DarkLightMode from "../DarkLightMode";
// import useDarkMode from "../hooks/useDarkMode";

const Header = ({ isSideBarOpen, setIsSideBarOpen }) => {
  const [isOptimisimOpen, setIsOptimisimOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  //   const [colorTheme, setTheme] = useDarkMode();

  return (
    <div>
      <div className="flex lg:hidden w-full items-center justify-between p-3 z-40 bg-[#0F172A]  sticky left-0 right-0 top-0">
        <img
          onClick={() => {
            setIsSideBarOpen(true);
          }}
          className=" cursor-pointer "
          src="./assets/icons/hamburger.svg"
          alt="hamburger"
        />
        <div className={`text-[#fff] font-bold text-lg flex items-center`}>
          Dashboard
        </div>

        <div className="flex items-center justify-between">
          <div className="mx-2">
            <DarkLightMode />
          </div>
          <div className="bg-[#1C1924] px-3 py-3 rounded-full">
            <img
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              className=" cursor-pointer w-5 h-5 "
              src="./assets/icons/opener.svg"
              alt="opener"
            />
          </div>
        </div>
      </div>
      <div
        className={`${
          isOpen
            ? "right-0 bg-[#0F172A] lg:bg-transparent px-5"
            : "-right-80 hidden lg:flex"
        } absolute z-50 top-0 px-8 py-20 w-72 lg:static flex flex-col lg:flex-row  lg:bg-transparent h-full lg:w-full lg:items-center lg:justify-between lg:py-5 `}
      >
        <img
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="fixed top-10 right-10 ml-5 lg:hidden cursor-pointer"
          src="../../assets/icons/close.svg"
          alt="close"
        />
        <div className="space-y-3 lg:space-y-0 lg:space-x-3 flex flex-col  items-center lg:flex-row">
          <button className=" bg-[#09080C] w-full lg:w-auto my-2 rounded-md py-2 px-4 shadow">
            <span className="gradient-text text-base">Grants</span>
          </button>

          <Link to={"/hackathon"} className="relative bg-[#09080C] w-full lg:w-auto my-2 rounded-md py-2 px-4 shadow">
            <span className="gradient-text text-base">Hackathons</span>

            <div className="coming-soon absolute -bottom-[14px] right-0 text-[#fff] px-3 py-1 rounded-xl text-xs">
              Coming Soon
            </div>
          </Link>
          <button className=" bg-[#09080C] w-full lg:w-auto my-2 rounded-md py-2 px-4 shadow">
            <span className="gradient-text text-base">Governance</span>
          </button>
          <button></button>
        </div>
        <div className=" space-y-3 lg:space-y-0 lg:space-x-3 flex flex-col lg:flex-row  lg:items-center">
          <div className="relative">
            <button
              onClick={() => {
                setIsOptimisimOpen(!isOptimisimOpen);
              }}
              className={`bg-[#1C1924] rounded-full w-full lg:w-auto flex items-center duration-300  ${
                isOptimisimOpen ? " px-10 " : " px-3 "
              } py-2`}
            >
              <img src="../../assets/images/op.png" alt="op" />
              <span className="gradient-text text-base ml-5"> Optimism</span>
            </button>

            <div
              className={`${
                isOptimisimOpen
                  ? "top-12 block mt-2"
                  : "-top-[400px] hidden lg:block"
              } lg:absolute top-12 left-0 text-[#fff] z-50 duration-300 dropsDownBg rounded-xl w-full px-3 py-6`}
            >
              <div className="flex mb-4 items-center justify-between">
                <h1 className="font-semibold">Select a network</h1>
                <img
                  onClick={() => {
                    setIsOptimisimOpen(!isOptimisimOpen);
                  }}
                  className="cursor-pointer"
                  src="../../assets/icons/close.svg"
                  alt="close"
                />
              </div>

              <div className="flex my-5 items-center justify-between">
                <div className="flex items-center">
                  <img src="../../assets/images/op.png" alt="op" />
                  <span className="text-lg ml-3"> Optimism</span>
                </div>
                <div className="w-3 h-3 bg-[#07D942] rounded-full"></div>
              </div>
              <div className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg">
                <img
                  className="w-8 h-8 mr-3"
                  src="../../assets/images/arbitrum.png"
                  alt="arbitrum"
                />{" "}
                <h2 className="font-medium text-sm">Arbitrum</h2>
              </div>
              <div className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg">
                <img
                  className="w-8 h-8 mr-3"
                  src="../../assets/images/polygon.png"
                  alt="polygon"
                />
                <h2 className="font-medium text-sm">Polygon</h2>
              </div>
              <div className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg">
                <img
                  className="w-8 h-8 mr-3"
                  src="../../assets/images/gnosis.png"
                  alt="gnosis"
                />
                <h2 className="font-medium text-sm">Gnosis</h2>
              </div>
              <div className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg">
                <img
                  className="w-8 h-8 mr-3"
                  src="../../assets/images/binance.png"
                  alt="binance"
                />
                <h2 className="font-medium text-sm">Binance</h2>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setIsUserOpen(!isUserOpen);
              }}
              className="bg-[#1C1924] rounded-full  w-full lg:w-auto justify-center flex items-center  px-3 py-2"
            >
              <span className="gradient-text font-bold text-base mx-1">
                {" "}
                0xBBB6...e96e
              </span>
              <img src="../../assets/icons/avatar.svg" alt="avatar" />
            </button>

            <div
              className={`${
                isUserOpen ? "top-12 block mt-2" : "-top-80 hidden lg:block"
              } lg:absolute top-12 left-0 text-[#fff] duration-300 z-50 dropsDownBg rounded-xl w-full px-3 py-4`}
            >
              <div className="flex items-center px-2 my-1 hover:bg-[#242A38] cursor-pointer p-2 rounded-lg">
                <img src="../../assets/icons/dashboard.svg" alt="dashboard" />
                <span className="text-sm ml-3"> Dashboard</span>
              </div>

              <div className="flex items-center px-2 my-1 hover:bg-[#242A38] cursor-pointer p-2 rounded-lg">
                <img src="../../assets/icons/support.svg" alt="support" />
                <span className="text-sm ml-3"> Support</span>
              </div>

              <div className="flex items-center px-2 my-1 hover:bg-[#242A38] cursor-pointer p-2 rounded-lg">
                <img src="../../assets/icons/logout.svg" alt="logout" />
                <span className="text-sm ml-3"> Logout</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <DarkLightMode />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
