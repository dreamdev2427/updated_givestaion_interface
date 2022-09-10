import React from "react";
import copyIcon from "./assets/copy.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NotificationManager } from "react-notifications";
import UserFooter from "../../components/user/UserFooter";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { chains } from "../../smart-contract/chains_constants";
import { useState } from "react";
import Sidebar1 from "../../components/user/Sidebar1";
import Header from "../../components/HeaderHome";
import Card from "../../components/user/Card";
import PageHeader from "../../components/user/PageHeader";
const CampaignFactory = require("../../smart-contract/build/CampaignFactory.json");

const GiveFrens = () => {
  const [isCopied, setIsCopied] = React.useState(false);
  const chainId = useSelector((state) => state.auth.currentChainId);
  const account = useSelector((state) => state.auth.currentWallet);
  const globalWeb3 = useSelector((state) => state.auth.globalWeb3);
  const [gpAmount, setGpAmount] = useState(0);
  const [refCounts, setRefCounts] = useState(0);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const getGPInfo = async () => {
    if (account && chainId && globalWeb3) {
      const factory = new globalWeb3.eth.Contract(
        CampaignFactory,
        chains[chainId?.toString()]?.factoryAddress
      );
      if (factory) {
        try {
          let gpamount =
            (await factory.methods.getStakedAmountWithRef(account).call()) || 0;
          gpamount = globalWeb3.utils.fromWei(gpamount.toString(), "ether");
          setGpAmount(gpamount);
          let refCounts =
            (await factory.methods
              .getCountsOfRefCausedGpStaking(account)
              .call()) || 0;
          setRefCounts(refCounts);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  useEffect(() => {
    getGPInfo();
  }, [account, globalWeb3, chainId]);

  const onClickClaim = async () => {
    if (account && chainId && globalWeb3 && gpAmount > 0) {
      const factory = new globalWeb3.eth.Contract(
        CampaignFactory,
        chains[chainId?.toString()]?.factoryAddress
      );
      if (factory) {
        try {
          await factory.methods.GPClaimRef(account).send({
            from: account,
            gas: 3000000,
          });
          getGPInfo();
        } catch (err) {
          console.error(err);
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
                <PageHeader heading={"Favourites"} />

                <div className="my-10 px-5">
                  <div className="card-gradient-bg px-10 py-6 sm:px-16 rounded-3xl text-center">
                    <p className="font-semibold text-base text-[#222222]">
                      Invite a friend to GiveStation and get GIVEPOINTS
                    </p>
                    <h3 className="mt-4 mb-6 text-lg font-normal">
                      Give a friend your referral code on GiveStation and you'll
                      get
                      <br />
                      POINTS token for free!{" "}
                    </h3>
                    <div className="flex text-base flex-col space-y-2 md:space-x-2 md:flex-row items-center justify-between">
                      <button className="flex items-center justify-center py-4 px-16 border-dashed rounded-full shadow-xl		border-2 border-[#222222]">
                        <img
                          className="mr-2"
                          src="./assets/icons/copy.svg"
                          alt="copy"
                        />
                        GIVEEQW2
                      </button>
                      <button className="text-[#fff] bg-[#000000] py-4 px-16 rounded-full">
                        Invite Friends
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between mt-10">
                    <div className="flex items-center space-x-3">
                      <div className="dark:bg-[#9797972B] bg-[#0F1B2E] flex flex-col items-center rounded-lg py-2 px-4">
                        <h2 className="text-[#09C9E3] text-lg font-bold">25</h2>
                        <p className="text-[#DADADA] font-normal text-sm">
                          Active Referrals
                        </p>
                      </div>

                      <div className="dark:bg-[#9797972B] bg-[#0F1B2E] flex flex-col items-center rounded-lg py-2 px-4">
                        <h2 className="text-[#EDD604] text-lg font-bold">
                          10 POINTS
                        </h2>
                        <p className="text-[#DADADA] font-normal text-sm">
                          Active Referrals
                        </p>
                      </div>
                    </div>
                    <button className="clain-2-btn rounded-xl text-[#fff] text-lg px-5 py-4">
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
  );
};

export default GiveFrens;
