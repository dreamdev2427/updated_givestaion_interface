import React from "react";
import SampleProject from "./assets/sampleProject.svg";
import HeartIcon from "./assets/heart.svg";
import { useNavigate, useParams } from "react-router";
import UserFooter from "../../components/user/UserFooter";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { backendURL } from "../../config";
import { chains } from "../../smart-contract/chains_constants";
import PageHeader from "../../components/user/PageHeader";
import Sidebar1 from "../../components/user/Sidebar1";
import Header from "../../components/HeaderHome";

const MyProjects = () => {
  const chainId = useSelector((state) => state.auth.currentChainId);
  const account = useSelector((state) => state.auth.currentWallet);
  const globalWeb3 = useSelector((state) => state.auth.globalWeb3);
  const [campaigns, setCampaigns] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const [isUpdateClick, setIsUpdateClick] = useState(false);
  const initProjectsInfo = async () => {
    if (chainId && globalWeb3 && account) {
      await axios({
        method: "post",
        url: `${backendURL}/api/campaign/getCampaignsOfUser`,
        data: {
          user: account || "",
          chainId: chainId || "",
        },
      })
        .then((res) => {
          if (res.data && res.data.code === 0) {
            setCampaigns(res.data.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  useEffect(() => {
    initProjectsInfo();
    setRefresh(!refresh);
  }, [account, globalWeb3, chainId, setRefresh]);

  const onClickUpdate = (campaignAddress) => {
    if (campaignAddress) navigate(`update/${campaignAddress}`);
  };

  return (
    <div className=" dark:bg-[#242A38] duration-300 ease-out	 bg-[#fff] min-h-screen">
      <div className="font-Jura ">
        <Sidebar1
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
        <div className=" lg:ml-72	lg:main">
          <Header
            setIsSideBarOpen={setIsSideBarOpen}
            isSideBarOpen={isSideBarOpen}
          />
          <div className="px-5 lg:px-8 mt-8">
            <div>
              <PageHeader heading={"My Projects"} />

              <div className="mt-10 pb-5 space-y-5">
                {!isUpdateClick ? (
                  <>
                    <div className="rounded-lg bg-[#131420] p-2 flex flex-col md:flex-row space-x-3">
                      <img
                        className="rounded-lg"
                        src="./assets/images/casino.png"
                        alt="casino"
                      />
                      <div className="text-[#fff] flex-1">
                        <div className="flex  flex-col sm:flex-row items-center  mt-2 md:mt-0 justify-center md:justify-start">
                          <h3 className="font-bold text-lg mr-4">
                            Casino Berilia{" "}
                          </h3>
                          <div>
                            <button className="font-bold mx-1 text-xs py-1 px-5 bg-[#00C938] rounded-xl">
                              Active
                            </button>
                            <button className="font-bold mx-1 text-xs py-1 px-5 bg-[#00C938] rounded-xl">
                              Verified
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-center md:flex-row md:items-end w-full justify-between">
                          <div className="flex flex-col items-center md:flex-row md:items-end mt-4 space-x-5">
                            <p className="text-center md:text-left md:max-w-[192px]">
                              225% up to AU$ 5,000 jhgfjjhghjkkkhgj
                              jhjkkkkhhkjhjkljhjklk hjkljhjlljkhklljklljklljk
                            </p>

                            <div className="bg-[#1B1C2D] hidden md:block w-[2px] h-10 rounded-lg"></div>

                            <div>
                              <div className="flex justify-between items-center">
                                <p className="font-normal text-xs mr-5 my-1">
                                  Minimum Contribution
                                </p>{" "}
                                <h3 className="font-semibold text-[#fff] text-xs">
                                  $2.50
                                </h3>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="font-normal text-xs mr-5 my-1">
                                  Target
                                </p>{" "}
                                <h3 className="font-semibold text-[#fff] text-xs">
                                  $22.50
                                </h3>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="font-normal text-xs mr-5 my-1">
                                  Raised
                                </p>{" "}
                                <h3 className="font-semibold text-[#fff] text-xs">
                                  $3.000
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="bg-[#1B1C2D] hidden md:block w-[2px] h-10 rounded-lg"></div>
                            <div className="flex flex-col items-center space-y-1">
                              <div className="flex items-center">
                                <img
                                  className="w-10"
                                  src="./assets/icons/heart.svg"
                                  alt="heart"
                                />
                                <h1 className="bg-[#EC007F] font-extrabold text-lg rounded-2xl px-2 text-center ">
                                  48
                                </h1>
                              </div>
                              <button
                                onClick={() => {
                                  setIsUpdateClick(!isUpdateClick);
                                }}
                                className="bg-[#52DCF0] text-[#000000] font-bold rounded-2xl flex items-center overflow-hidden justify-center py-3 px-4"
                              >
                                Update
                                <img
                                  src="./assets/icons/arrow-right.svg"
                                  alt="arrow-right"
                                />
                              </button>
                              <p className="text-[#B09DFF] text-xs">
                                view campaign
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#131420] p-2 flex flex-col md:flex-row space-x-3">
                      <img
                        className="rounded-lg"
                        src="./assets/images/casino.png"
                        alt="casino"
                      />
                      <div className="text-[#fff] flex-1">
                        <div className="flex  flex-col sm:flex-row items-center  mt-2 md:mt-0 justify-center md:justify-start">
                          <h3 className="font-bold text-lg mr-4">
                            Casino Berilia{" "}
                          </h3>
                          <div>
                            <button className="font-bold mx-1 text-xs py-1 px-5 bg-[#00C938] rounded-xl">
                              Active
                            </button>
                            <button className="font-bold mx-1 text-xs py-1 px-5 bg-[#00C938] rounded-xl">
                              Verified
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-center md:flex-row md:items-end w-full justify-between">
                          <div className="flex flex-col items-center md:flex-row md:items-end mt-4 space-x-5">
                            <p className="text-center md:text-left md:max-w-[192px]">
                              225% up to AU$ 5,000 jhgfjjhghjkkkhgj
                              jhjkkkkhhkjhjkljhjklk hjkljhjlljkhklljklljklljk
                            </p>

                            <div className="bg-[#1B1C2D] hidden md:block w-[2px] h-10 rounded-lg"></div>

                            <div>
                              <div className="flex justify-between items-center">
                                <p className="font-normal text-xs mr-5 my-1">
                                  Minimum Contribution
                                </p>{" "}
                                <h3 className="font-semibold text-[#fff] text-xs">
                                  $2.50
                                </h3>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="font-normal text-xs mr-5 my-1">
                                  Target
                                </p>{" "}
                                <h3 className="font-semibold text-[#fff] text-xs">
                                  $22.50
                                </h3>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="font-normal text-xs mr-5 my-1">
                                  Raised
                                </p>{" "}
                                <h3 className="font-semibold text-[#fff] text-xs">
                                  $3.000
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="bg-[#1B1C2D] hidden md:block w-[2px] h-10 rounded-lg"></div>
                            <div className="flex flex-col items-center space-y-1">
                              <div className="flex items-center">
                                <img
                                  className="w-10"
                                  src="./assets/icons/heart.svg"
                                  alt="heart"
                                />
                                <h1 className="bg-[#EC007F] font-extrabold text-lg rounded-2xl px-2 text-center ">
                                  48
                                </h1>
                              </div>
                              <button
                                onClick={() => {
                                  setIsUpdateClick(!isUpdateClick);
                                }}
                                className="bg-[#52DCF0] text-[#000000] font-bold rounded-2xl flex items-center overflow-hidden justify-center py-3 px-4"
                              >
                                Update
                                <img
                                  src="./assets/icons/arrow-right.svg"
                                  alt="arrow-right"
                                />
                              </button>
                              <p className="text-[#B09DFF] text-xs">
                                view campaign
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#131420] p-2 flex flex-col md:flex-row space-x-3">
                      <img
                        className="rounded-lg"
                        src="./assets/images/casino.png"
                        alt="casino"
                      />
                      <div className="text-[#fff] flex-1">
                        <div className="flex  flex-col sm:flex-row items-center  mt-2 md:mt-0 justify-center md:justify-start">
                          <h3 className="font-bold text-lg mr-4">
                            Casino Berilia{" "}
                          </h3>
                          <div>
                            <button className="font-bold mx-1 text-xs py-1 px-5 bg-[#00C938] rounded-xl">
                              Active
                            </button>
                            <button className="font-bold mx-1 text-xs py-1 px-5 bg-[#00C938] rounded-xl">
                              Verified
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-center md:flex-row md:items-end w-full justify-between">
                          <div className="flex flex-col items-center md:flex-row md:items-end mt-4 space-x-5">
                            <p className="text-center md:text-left md:max-w-[192px]">
                              225% up to AU$ 5,000 jhgfjjhghjkkkhgj
                              jhjkkkkhhkjhjkljhjklk hjkljhjlljkhklljklljklljk
                            </p>

                            <div className="bg-[#1B1C2D] hidden md:block w-[2px] h-10 rounded-lg"></div>

                            <div>
                              <div className="flex justify-between items-center">
                                <p className="font-normal text-xs mr-5 my-1">
                                  Minimum Contribution
                                </p>{" "}
                                <h3 className="font-semibold text-[#fff] text-xs">
                                  $2.50
                                </h3>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="font-normal text-xs mr-5 my-1">
                                  Target
                                </p>{" "}
                                <h3 className="font-semibold text-[#fff] text-xs">
                                  $22.50
                                </h3>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="font-normal text-xs mr-5 my-1">
                                  Raised
                                </p>{" "}
                                <h3 className="font-semibold text-[#fff] text-xs">
                                  $3.000
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="bg-[#1B1C2D] hidden md:block w-[2px] h-10 rounded-lg"></div>
                            <div className="flex flex-col items-center space-y-1">
                              <div className="flex items-center">
                                <img
                                  className="w-10"
                                  src="./assets/icons/heart.svg"
                                  alt="heart"
                                />
                                <h1 className="bg-[#EC007F] font-extrabold text-lg rounded-2xl px-2 text-center ">
                                  48
                                </h1>
                              </div>
                              <button
                                onClick={() => {
                                  setIsUpdateClick(!isUpdateClick);
                                }}
                                className="bg-[#52DCF0] text-[#000000] font-bold rounded-2xl flex items-center overflow-hidden justify-center py-3 px-4"
                              >
                                Update
                                <img
                                  src="./assets/icons/arrow-right.svg"
                                  alt="arrow-right"
                                />
                              </button>
                              <p className="text-[#B09DFF] text-xs">
                                view campaign
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <form className="flex flex-col mb-5 md:px-5">
                    <label className="dark:text-[#FFFFFF] text-[#000] opacity-70 text-center">
                      Project description
                    </label>
                    <textarea className="innerShadow  bg-[#242A38] dark:bg-[#fff] h-20 rounded-2xl my-2	p-4 outline-none" />

                    <label className="dark:text-[#FFFFFF] text-[#000] opacity-70 mt-2 mb-1">
                      Categories
                    </label>
                    <input className="innerShadow bg-[#242A38] dark:bg-[#fff] rounded-2xl my-2 p-4 outline-none" />
                    <label className="dark:text-[#FFFFFF] text-[#000] opacity-70 mt-2 mb-1">
                      Image URL
                    </label>
                    <input className="innerShadow bg-[#242A38] dark:bg-[#fff] rounded-2xl my-2 p-4 outline-none" />
                    <label className="dark:text-[#FFFFFF] text-[#000]  opacity-70 mt-2 mb-1">
                      Creators Address
                    </label>
                    <input className="innerShadow bg-[#242A38] dark:bg-[#fff] rounded-2xl my-2 p-4 outline-none" />

                    <button
                      onClick={() => {
                        setIsUpdateClick(!isUpdateClick);
                      }}
                      className="bg-[#52DCF0] text-[#000000] font-bold rounded-2xl w-fit self-center	 flex items-center overflow-hidden justify-center py-3 px-4"
                    >
                      Update
                      <img
                        src="./assets/icons/arrow-right.svg"
                        alt="arrow-right"
                      />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
