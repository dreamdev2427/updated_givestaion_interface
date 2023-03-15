import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import UserFooter from "../../components/user/UserFooter";
import { chains } from "../../smart-contract/chains_constants";
import Sidebar1 from "../../components/user/Sidebar1";
import Header from "../../components/HeaderHome";
import Card from "../../components/user/Card";
import PageHeader from "../../components/user/PageHeader";
import { backendURL } from "../../config";

const CampaignFactory = require("../../smart-contract/build/CampaignFactory.json");

const GivePoints = () => {
  const [claimed, setClaimed] = useState(false);
  const chainId = useSelector((state) => state.auth.currentChainId);
  const account = useSelector((state) => state.auth.currentWallet);
  const globalWeb3 = useSelector((state) => state.auth.globalWeb3);
  const [gpAmount, setGpAmount] = useState(0);
  const [opAmount, setOpAmount] = useState(0);
  const [campaignCounts, setCampaignCounts] = useState(0);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isClaimed, setIsClaimed] = useState(false);

  const getGPInfo = async () => {
    if (account && chainId && globalWeb3) {
      const factory = new globalWeb3.eth.Contract(
        CampaignFactory,
        chains[chainId?.toString()]?.factoryAddress
      );
      if (factory) {
        try {
          let gpamount =
            (await factory.methods.getStakedAmount(account).call()) || 0;
          gpamount = globalWeb3.utils.fromWei(gpamount.toString(), "ether");
          setGpAmount(gpamount);
          let camCounts =
            (await factory.methods
              .getCountOfCampaignsCausedGpStaking(account)
              .call()) || 0;
          setCampaignCounts(camCounts);
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  const getOPInfo = async () => {
    let opRewards = 0;
    await axios({
      method: "post",
      url: `${backendURL}/api/opRewards/getOpRewardsOfUser`,
      data: {
        user: account || "",
        chainId: chainId || "",
      },
    })
      .then((res) => {
        console.log("getOPInfo ===> ", res);
        if (res.data && res.data.code === 0) {
          opRewards = res.data.data !== null ? res.data.data.amount : 0;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setOpAmount(opRewards);
    return opRewards;
  };

  useEffect(() => {
    getGPInfo();
    getOPInfo();
  }, [account, globalWeb3, chainId]);

  const onClickOPClaim = async () => {
    NotificationManager.warning(
      "Please be paitent, Givestation team will distribute rewards to you."
    );
  };

  const onClickClaim = async () => {
    if (account && chainId && globalWeb3 && gpAmount > 0) {
      const factory = new globalWeb3.eth.Contract(
        CampaignFactory,
        chains[chainId?.toString()]?.factoryAddress
      );
      if (factory) {
        try {
          await factory.methods.GPClaim(account).send({
            from: account,
            gas: 3000000,
          });
          setClaimed(true);
          getGPInfo();
        } catch (err) {
          console.log(err);
          if (err.code && err.code === 4100)
            NotificationManager.warning(
              "Please unlock your wallet and try again."
            );
        }
      }
    } else {
      NotificationManager.warning("Please connect your wallet.");
    }
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
            <div className="flex items-center justify-center">
              <div>
                <PageHeader heading={"GivePoints"} />

                <div className="my-14 px-5">
                  <div className="card-gradient-points-bg max-w-[700px] rounded-3xl px-8 py-14">
                    <div className="text-center sm:text-left">
                      <p className="text-[#7E7E7E] mb-3">
                        CLAIM YOUR GIVE POINTS
                      </p>
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-1">
                          <h1 className="text-[#fff] font-bold text-3xl">
                            {isClaimed ? (
                              <>
                                You have succesfully claimed{" "}
                                <span className="text-[#52DCF0]">
                                  {gpAmount}
                                </span>
                                POINTS for donating to {campaignCounts}{" "}
                                <span className="text-[#52DF0]">
                                  {" "}
                                  campaigns
                                </span>
                                .
                              </>
                            ) : (
                              <>
                                You have earned{" "}
                                <span className="text-[#52DCF0]">
                                  {gpAmount}
                                </span>{" "}
                                GIVEPOINTS for donating to {campaignCounts}
                                <span className="text-[#52DCF0]">
                                  {" "}
                                  campaigns
                                </span>
                                .
                              </>
                            )}
                          </h1>
                        </div>
                        <div className="flex mt-2 sm:mt-0 items-start justify-center flex-1">
                          <button
                            onClick={() => {
                              setIsClaimed(!isClaimed);
                              onClickClaim();
                            }}
                            className={`${
                              isClaimed ? "btn-claimed" : "btn"
                            } rounded-lg px-5 py-3 text-[#fff] font-semibold text-lg`}
                          >
                            CLAIM
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 card-gradient-points-bg max-w-[700px] rounded-3xl px-8 py-14">
                    <div className="text-center sm:text-left">
                      <p className="text-[#7E7E7E] mb-3">
                        CLAIM YOUR GIVE POINTS
                      </p>
                      <div className="flex flex-col sm:flex-row">
                        <div className="flex-1">
                          <h1 className="text-[#fff] font-bold text-3xl">
                            {isClaimed ? (
                              <>
                                You have succesfully claimed{" "}
                                <span className="text-[#52DCF0]">
                                  {gpAmount}
                                </span>
                                OPs.
                              </>
                            ) : (
                              <>
                                You have earned{" "}
                                <span className="text-[#52DCF0]">
                                  {opAmount}
                                </span>{" "}
                                OPs for donatings on OPTIMSIM network.
                              </>
                            )}
                          </h1>
                        </div>
                        <div className="flex mt-2 sm:mt-0 items-start justify-center flex-1">
                          <button
                            onClick={() => {
                              onClickOPClaim();
                            }}
                            className={`${
                              isClaimed ? "btn-claimed" : "btn"
                            } rounded-lg px-5 py-3 text-[#fff] font-semibold text-lg`}
                          >
                            CLAIM
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GivePoints;
