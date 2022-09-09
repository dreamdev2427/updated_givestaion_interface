import { useState } from "react";
import { NavLink } from "react-router-dom";
import HeaderHome from "../components/HeaderHome";
import UserFooter from "../components/user/UserFooter";

export const Category = [
  "Defi",
  "Education",
  "Blockchain",
  "Fintech",
  "Research",
  "Nutrition",
  "Art-culture",
  "Agriculture",
  "Air",
  "Biodiversity",
  "Climate",
  "Community",
  "Food",
  "Non-profit",
  "Housing",
  "Technology",
  "Research",
  "Nutrition",
  "Employment",
  "Energy",
  "Finanace",
  "Health",
  "Infrastructure",
  "Pollution",
  "Real-estate",
  "Waste",
  "Water",
  "Web3",
  "Music",
  "Nft",
  "Event",
  "Space",
  "Other",
];

const Hackathon = () => {
  const [dropdown, setDropdown] = useState(false);
  const [searchingName, setSearchingName] = useState(undefined);
  const [searchingCategory, setSearchingCategory] = useState(undefined);
  return (
    <div className="dark:bg-slate-900 duration-300 text-[#fff]">
      <HeaderHome />

      <div className=" b3 bg-no-repeat bg-cover sm:bg-contain md:bg-cover rounded-[20px] container md:rounded-[30px] bg-center w-full  py-10 md:py-10 lg:py-24">
        <div className="max-w-[65%] sm:max-w-[70%] md:max-w-[65%] lg:max-w-[60%] text-[#FAFAFA] pl-6 md:pl-10 lg:pl-12">
          <h1 className="font-bold text-sm  sm:text-base mb-3 md:text-2xl lg:text-4xl  md:mb-5">
            Participate in a hackathon, or create your own hackathon on
            GiveStation.
          </h1>
          <div className="createbtn inline sm:px-4 px-2 text-xs sm:text-xs md:text-lg py-2 pb-3">
            <span className="cs">Coming Soon</span>
          </div>
        </div>
      </div>
      <div className="container py-3 px-3">
        {/* <div className="flex flex-col space-y-4 sm:flex-row items-center  my-4 justify-between">
          <h1 className="font-bold text-[28px] leading-7 text-[#09080C] dark:text-[#fff]">
            Explore Hackathons
          </h1>

          <div className="flex sm:flex-row flex-col  space-y-2 sm:space-y-0 sm:items-center sm:space-x-2 ">
            <div className=" bg-[#E2E0E0] h-9 rounded-full px-3 dark:bg-transparent border border-[#E2E0E0] dark:border-[#fff] flex items-center">
              <svg
                fill="none"
                stroke="#3FABB3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>

              <input
                className="bg-transparent pl-4 outline-none"
                placeholder="Search..."
              />
            </div>

            <div
              onClick={() => {
                setIsDropDownOpen(!isDropDownOpen);
              }}
              className="bg-[#41AEDD] relative rounded-full h-[34px] flex items-center px-4  cursor-pointer"
            >
              <h3 className="text-[#000104] font-bold text-xl justify-center text-center ">
                {" "}
                See All
              </h3>
              {isDropDownOpen && (
                <div className="absolute bg-[#1C1924] w-full sm:w-[175px] max-h-[374px] noScrollBar overflow-auto rounded-lg px-4 py-2 right-0 top-10 z-40">
                  {Category.map((text, index) => (
                    <h4
                      className="hover:bg-[#242A38] rounded-lg p-2  duration-300"
                      key={index}
                    >
                      {text}
                    </h4>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div> */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold dark:text-gray-100">
            Explore Hackathons
          </h2>
          <div className="hidden md:flex flex-wrap items-start">
            <div className="relative  text-gray-600 focus-within:text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button className="p-1 focus:outline-none focus:shadow-outline">
                  <svg
                    fill="none"
                    stroke="#3FABB3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </span>
              <input
                type="search"
                name="q"
                className="py-2 text-sm dark:text-white text-gray-900 bg-white dark:bg-gray-900 pl-10 focus:outline-none focus:bg-white focus:dark:text-white focus:text-gray-900 rounded-3xl"
                placeholder="Search..."
                autoComplete="off"
                value={searchingName}
                onChange={(e) => {
                  setSearchingName(e.target.value);
                }}
              />
            </div>
            <div className="relative">
              <button
                className="sm:ml-3 ml-0 py-2 px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 flex items-center justify-between"
                type="button"
                onClick={() => {
                  setDropdown(!dropdown);
                }}
                // style={{ minWidth:"200px" }}
              >
                {!searchingCategory ? "See All" : searchingCategory}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {/* <!-- Dropdown menu --> */}
              {dropdown ? (
                <>
                  <div
                    id="dropdown"
                    className="absolute  top-12 right-0 z-10 bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700"
                  >
                    <ul
                      className="py-1 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefault"
                      style={{ overflowY: "scroll", maxHeight: "300px" }}
                    >
                      {Category.map((i, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setSearchingCategory(i);
                            setDropdown(!dropdown);
                          }}
                        >
                          <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                            {i}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden flex lg:flex-wrap md:flex-nowrap items-center my-10">
          <div className="relative  text-gray-600 focus-within:text-gray-400">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button className="p-1 focus:outline-none focus:shadow-outline">
                <svg
                  fill="none"
                  stroke="#3FABB3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </span>
            <input
              type="search"
              name="q"
              className="py-2 text-sm dark:text-white text-gray-900 bg-white dark:bg-gray-900 pl-10 focus:outline-none focus:bg-white focus:dark:text-white focus:text-gray-900 rounded-3xl"
              placeholder="Search..."
              autoComplete="off"
              value={searchingName}
              onChange={(e) => {
                setSearchingName(e.target.value);
              }}
            />
          </div>
          <div className="overflow-hidden flex overflow-x-auto categoryWrap">
            {Category.map((i, index) => (
              <div className="px-2" key={index}>
                {/* <div className="block text-center py-2 px-4 sm:px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 whitespace-nowrap">{i.name}</div> */}
                <button
                  type="button"
                  // className="block text-center text-md leading-5 dark:text-slate-800  font-bold rounded-full text-gray-100 whitespace-nowrap"
                  className={
                    // i.active?
                    "block text-center px-4 py-4 bg-gradient-secondary text-md leading-5 text-slate-800 font-bold rounded-full dark:text-gray-100 whitespace-nowrap mobFilterItem text-ellipsis overflow-hidden focus:bg-gradient-secondary"
                    // :
                    // "block text-center text-md px-4 py-4 bg-white leading-5 text-slate-800 dark:text-gray-100  font-bold rounded-full  whitespace-nowrap mobFilterItem text-ellipsis overflow-hidden focus:bg-gradient-secondary"
                  }
                  onClick={() => {
                    setSearchingCategory(i);
                  }}
                >
                  {i}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 ">
          <div className="px-5 py-8 campaignCard dark:bg-[#fff] duration-300 bg-slate-900 shadow-md ">
            <div className="flex items-center justify-between">
              <h1 className="gT font-bold text-3xl">SOLANA</h1>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <img src="./images/heart-small.svg" alt="heart-small" />
                  <p className="absolute top-1/2 left-1/2 z-30 text-[#fff] -translate-x-1/2 -translate-y-1/2">
                    48
                  </p>
                </div>
                <img src="./images/share.svg" alt="share" />
              </div>
            </div>

            <div className="my-3 relative">
              <img
                className="w-full"
                src="./images/hackathon-img.png"
                alt="hackathon"
              />
              <img
                className="absolute top-3 right-3"
                src="./images/verified.svg"
                alt="verified"
              />
            </div>

            <div className="flex items-center justify-between">
              <h1 className="text-[#006ED4] dark:text-[#41AEDD] font-bold text-[22px] leading-[26px]">
                Solana BUIDL S4
              </h1>
              <p className="bg-[#41AEDD] rounded-md px-2">DeFi</p>
            </div>
            <p className="text-[#006ED4] max-w-[60%] font-normal text-sm leading-[17px] mt-1.5 mb-3">
              50+ patents, trademarks and copyrights
            </p>
            <h3 className="dark:text-[#232323] dark:opacity-100 opacity-80 text-[#fff] mt-2">
              Prize
            </h3>
            <h1 className="text-[#fff] font-semibold text-xl leading-[23px] dark:text-[#000104]">
              $ 2,661,895
            </h1>

            <div className="flex items-center space-x-2 my-2">
              <button className="flex-1 bG rounded-lg py-2 text-[#000000] font-bold text-lg leading-[21px]">
                JOIN
              </button>
              <button className="flex-1 dark:bg-[#09080C]  bg-[#09080C] rounded-lg py-2  font-bold text-lg leading-[21px]">
                <span className="gT">10 Days left</span>
              </button>
            </div>
          </div>
          <div className="px-5 py-8 campaignCard dark:bg-[#fff] duration-300 bg-slate-900 shadow-md ">
            <div className="flex items-center justify-between">
              <h1 className="gT font-bold text-3xl">CELO</h1>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <img src="./images/heart-small.svg" alt="heart-small" />
                  <p className="absolute top-1/2 left-1/2 z-30 text-[#fff] -translate-x-1/2 -translate-y-1/2">
                    48
                  </p>
                </div>
                <img src="./images/share.svg" alt="share" />
              </div>
            </div>

            <div className="my-3 relative">
              <img
                className="w-full"
                src="./images/hackathon-img.png"
                alt="hackathon"
              />
              <img
                className="absolute top-3 right-3"
                src="./images/verified.svg"
                alt="verified"
              />
            </div>

            <div className="flex items-center justify-between">
              <h1 className="text-[#006ED4] dark:text-[#41AEDD] font-bold text-[22px] leading-[26px]">
                WEB3 For Agro-allied.
              </h1>
              <p className="bg-[#41AEDD] rounded-md px-2">Tech</p>
            </div>
            <p className="text-[#006ED4] max-w-[60%] font-normal text-sm leading-[17px] mt-1.5 mb-3">
              50+ patents, trademarks and copyrights
            </p>
            <h3 className="dark:text-[#232323] dark:opacity-100 opacity-80 text-[#fff] mt-2">
              Prize
            </h3>
            <h1 className="text-[#fff] font-semibold text-xl leading-[23px] dark:text-[#000104]">
              $ 2,661,895
            </h1>

            <div className="flex items-center space-x-2 my-2">
              <button className="flex-1 bG rounded-lg py-2 text-[#000000] font-bold text-lg leading-[21px]">
                JOIN
              </button>
              <button className="flex-1 dark:bg-[#09080C]  bg-[#09080C] rounded-lg py-2  font-bold text-lg leading-[21px]">
                <span className="gT">51 Days left</span>
              </button>
            </div>
          </div>
          <div className="px-5 py-8 campaignCard dark:bg-[#fff] duration-300 bg-slate-900 shadow-md ">
            <div className="flex items-center justify-between">
              <h1 className="gT font-bold text-3xl">CELO</h1>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <img src="./images/heart-small.svg" alt="heart-small" />
                  <p className="absolute top-1/2 left-1/2 z-30 text-[#fff] -translate-x-1/2 -translate-y-1/2">
                    48
                  </p>
                </div>
                <img src="./images/share.svg" alt="share" />
              </div>
            </div>

            <div className="my-3 relative">
              <img
                className="w-full"
                src="./images/hackathon-img.png"
                alt="hackathon"
              />
              <img
                className="absolute top-3 right-3"
                src="./images/verified.svg"
                alt="verified"
              />
            </div>

            <div className="flex items-center justify-between">
              <h1 className="text-[#006ED4] dark:text-[#41AEDD] font-bold text-[22px] leading-[26px]">
                Blockchain Community.
              </h1>
              <p className="bg-[#41AEDD] rounded-md px-2">web3</p>
            </div>
            <p className="text-[#006ED4] max-w-[60%] font-normal text-sm leading-[17px] mt-1.5 mb-3">
              50+ patents, trademarks and copyrights
            </p>
            <h3 className="dark:text-[#232323] dark:opacity-100 opacity-80 text-[#fff] mt-2">
              Prize
            </h3>
            <h1 className="text-[#fff] font-semibold text-xl leading-[23px] dark:text-[#000104]">
              $ 2,661,895
            </h1>

            <div className="flex items-center space-x-2 my-2">
              <button className="flex-1 bG rounded-lg py-2 text-[#000000] font-bold text-lg leading-[21px]">
                JOIN
              </button>
              <button className="flex-1 dark:bg-[#09080C]  bg-[#09080C] rounded-lg py-2  font-bold text-lg leading-[21px]">
                <span className="gT">6 Days left</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default Hackathon;
