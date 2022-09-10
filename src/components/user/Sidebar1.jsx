import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { useEffect } from "react";

const Menu1 = [
  {
    text: "Overview",
    icon: "overview",
    activeIcon: "overview-active",
    href: "/overview",
  },
  {
    text: "My Grants",
    icon: "myprojects",
    activeIcon: "myprojects-active",
    href: "/myprojects",
  },
  {
    text: "Donations",
    icon: "donations",
    activeIcon: "donations-active",
    href: "/donations",
  },
];

const Menu2 = [
  {
    text: "Favourites",
    icon: "favourite",
    activeIcon: "favourite-active",
    href: "/favourites",
  },
  {
    text: "GivePOINTS",
    icon: "givepoints",
    activeIcon: "givepoints-active",
    href: "/givepoints",
  },
  {
    text: "Give Frens",
    icon: "givefrens",
    activeIcon: "givefrens-active",
    href: "/givefrens",
  },
];

const NavItem = ({ href, text, icon, activeIcon, clickHandler }) => {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [navItem, setNavItem] = useState("Overview");
  const [donorOrCreator, setDonorOrCreator] = useState(false);   //true:donor, false:creator

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1500px)' });


  return (
    <NavLink
      onClick={() => {
        clickHandler(false);
      }}
      to={href}
    >
      {({ isActive }) => (
        <div className="flex">
          {
            <div
              className={`relative rounded-r-full w-6 mr-5 ${
                isActive ? "bg-[#00fbff] backdrop-blur-2xl	" : "bg-transparent"
              } `}
            >
              <span
                className={`absolute top-0 left-0 z-50 w-3 mr-5 ${
                  isActive && " bg-[#fff]"
                } `}
              ></span>
            </div>
          }
          <div
            className={`flex my-2 items-center ${
              isActive ? "bg-[#242A38]  " : "bg-transparent"
            } py-2 duration-300 rounded-lg px-3`}
          >
            <img
              src={`../../assets/icons/${isActive ? activeIcon : icon}.svg`}
              alt={icon}
            />
            <h3
              className={`font-light ml-5	text-xl ${
                isActive && "gradient-text"
              }`}
            >
              {text}
            </h3>
          </div>
        </div>
      )}
    </NavLink>
  );
};

const Sidebar1 = ({ isSideBarOpen, setIsSideBarOpen }) => {

  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [navItem, setNavItem] = useState("Overview");
  const [donorOrCreator, setDonorOrCreator] = useState(false);   //true:donor, false:creator

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1500px)' });
  const [activeButton, setActiveButton] = useState({
    creater: true,
    donor: false,
  });

  return (
    <aside>
      <div
        className={`${
          isSideBarOpen ? "left-0" : "-left-96"
        } bg-[#0F172A] h-full fixed top-0 lg:left-0 duration-300  z-50 lg:w-72 py-3`}
        aria-label="Sidebar"
      >
        <div className="flex items-center px-5 ">
          <img className="w-16" src="../../images/logo.svg" alt="logo" />

          <h1 className="text-3xl font-bold gradient-text">GiveStation</h1>

          <img
            onClick={() => {
              setIsSideBarOpen(!isSideBarOpen);
            }}
            className="ml-5 lg:hidden cursor-pointer"
            src="./assets/icons/close.svg"
            alt="close"
          />
        </div>

        <nav className="text-[#fff] sm:my-3 md:my-5">
          {Menu1.map(({ text, icon, activeIcon, href }, index) => (
            donorOrCreator === true && index === 1?
            <></>
            :
            <NavItem
              key={index}
              text={text}
              icon={icon}
              activeIcon={activeIcon}
              href={href}
              clickHandler={setIsSideBarOpen}
            />
          ))}

          <div className="max-w-[170px] bg-[#52DCF01A] h-[2px] my-3  mx-auto "></div>
          {Menu2.map(({ text, icon, activeIcon, href }, index) => (
            <NavItem
              key={index}
              text={text}
              icon={icon}
              activeIcon={activeIcon}
              href={href}
              clickHandler={setIsSideBarOpen}
            />
          ))}
        </nav>

        <div className="bg-[#000101] rounded-xl mx-3 p-1.5 flex items-center justify-center">
          <button
            onClick={() => {
              setActiveButton({
                creater: false,
                donor: true,
              });
              setDonorOrCreator(true);
            }}
            className={`px-5 py-3 w-1/2 text-xl font-semibold rounded-xl ${
              activeButton.donor
                ? " donor text-[#000000]"
                : "bg-transparent  text-[#fff] "
            } `}
          >
            Donor
          </button>

          <button
            onClick={() => {
              setActiveButton({
                donor: false,
                creater: true,
              });
              setDonorOrCreator(false);
            }}
            className={`px-5 py-3 w-1/2 text-xl font-semibold rounded-xl ${
              activeButton.creater
                ? " donor text-[#000000]"
                : "bg-transparent  text-[#fff] "
            } `}
          >
            Creator
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar1;
