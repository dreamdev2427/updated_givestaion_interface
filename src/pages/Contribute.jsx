import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { backendURL } from "../config";
import UserFooter from "../components/user/UserFooter";
import Header from "../components/HeaderHome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Confetti from "react-confetti";
import { useMediaQuery } from "react-responsive";
import { chains, OPTIMISTIC_CHAIN_ID, OPTIMISTIC_NETWORK_ID, GOERLI_CHAIN_ID, GOERLI_NETWORK_ID } from "../smart-contract/chains_constants";
import parse from "html-react-parser";
const CampaignFactory = require("../smart-contract/build/CampaignFactory.json");
const Campaign = require("../smart-contract/build/Campaign.json");

export default function Contribute() {
  const history = useNavigate();
  const [summary, setSummary] = useState({});
  const [showConfirmDlg, setShowConfirmDlg] = useState(false);
  const [popup, setPopup] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);
  const [campaignIdOnDB, setCampaignIdOnDB] = useState(null);
  const [copied, setCopied] = useState(false);
  const [donatingPopup, showDonatingPopup] = useState(false);
  const [gpAmount, setGpAmount] = useState(0);

  const chainId = useSelector((state) => state.auth.currentChainId);
  const account = useSelector((state) => state.auth.currentWallet);
  const globalWeb3 = useSelector((state) => state.auth.globalWeb3);
  const refAddr = useSelector((state) => state.auth.referralAddress);

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  var colorMode = null;

  const showLoader = () => {
    setTimeout(() => {
      setLoading(false);
      setPopup(!popup);
    }, 2000);
  };

  colorMode = localStorage.getItem("color-theme");

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
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  useEffect(() => {
    getGPInfo();
  }, [account, globalWeb3, chainId]);

  useEffect(() => {
    if (account && chainId && globalWeb3 && id) {
      const getSummary = async () => {
        try {
          const factory = new globalWeb3.eth.Contract(
            CampaignFactory,
            chains[chainId?.toString()].factoryAddress
          );
          let summa = null;
          if (factory) {
            summa = await new globalWeb3.eth.Contract(Campaign, id).methods
              .getSummary()
              .call();
          }
          if (summa !== null) {
            await axios({
              method: "post",
              url: `${backendURL}/api/campaign/all`,
              data: {
                chainId: chainId || "",
                address: id,
              },
            })
              .then((res) => {
                if (res.data && res.data.code === 0) {
                  let summaryFromDB = res.data.data[0] || [];
                  if (summaryFromDB !== undefined) {
                    summa[5] = summaryFromDB.name;
                    summa[6] = summaryFromDB.description;
                    summa[7] = summaryFromDB.imageURL;
                    summa[9] = summaryFromDB.verified;
                    summa[11] = summaryFromDB.category;
                    summa[12] = summaryFromDB.raised;
                    summa[13] = summaryFromDB.websiteurl;
                    summa[14] = summaryFromDB.telegramurl;
                    summa[15] = summaryFromDB.twitterurl;
                  }
                  setCampaignIdOnDB(summa[10]);
                  setSummary(summa);
                }
              })
              .catch((err) => {
                console.error(err);
              });
          }
        } catch (e) {
          console.error(e);
        }
      };
      getSummary();
    } else if (id) {
      const getSummaryFromDB = async () => {
        await axios({
          method: "post",
          url: `${backendURL}/api/campaign/all`,
          data: {
            address: id,
          },
        })
          .then((res) => {
            if (res.data.code === 0) {
              let summa = {};
              let summaryFromDB = res.data.data[0] || [];
              if (summaryFromDB !== undefined) {
                summa[5] = summaryFromDB.name;
                summa[6] = summaryFromDB.description;
                summa[7] = summaryFromDB.imageURL;
                summa[9] = summaryFromDB.verified;
                summa[11] = summaryFromDB.category;
                summa[12] = summaryFromDB.raised;
                summa[13] = summaryFromDB.websiteurl;
                summa[14] = summaryFromDB.telegramurl;
                summa[15] = summaryFromDB.twitterurl;
                setCampaignIdOnDB(summaryFromDB._id);
              }
              setSummary(summa);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      };
      getSummaryFromDB();
    }
  }, [account, chainId, globalWeb3, id]);

  const onChangeDonationAmount = (value) => {
    let previous = donationAmount;
    if (isNaN(value) === true) setDonationAmount(previous);
    else setDonationAmount(value);
  };

  const onClickContribute = async () => {
    if (Number(donationAmount) > 0) {
      if(Number(globalWeb3?.utils?.fromWei(summary[8]?.toString() || "0", "ether").toString()) <= Number(globalWeb3?.utils?.fromWei(summary[1]?.toString() || "0", "ether").toString()))
      {
        NotificationManager.warning(
          "Target is reached, You can not contribut any more."
        );
        return;
      }
      if (globalWeb3 && account) {
        showDonatingPopup(true);
        try {
          await new globalWeb3.eth.Contract(Campaign, id).methods
            .contribute(refAddr)
            .send({
              from: account,
              gas: 3000000,
              value: globalWeb3.utils.toWei(donationAmount.toString(), "ether")
            });
          await axios({
            method: "post",
            url: `${backendURL}/api/donation/create`,
            data: {
              campaign: campaignIdOnDB || "",
              amount: Number(donationAmount) * 0.98,
              donor: account || "",
              chainId: chainId || "",
            },
          })
            .then((res) => {
              if (res.data && res.data.code === 0) {
                showDonatingPopup(false);
                setLoading(true);
                setTimeout(() => {
                  showLoader();
                }, 2000);
              }
            })
            .catch((err) => {
              showDonatingPopup(false);
              console.error(err);
            });
        } catch (err) {
          showDonatingPopup(false);
          console.error(err);
          if (err.code && err.code === 4100)
            NotificationManager.warning(
              "Please unlock your wallet and try again."
            );
        }
        showDonatingPopup(false);
      } else {
        NotificationManager.warning("Connect your wallet!");
      }
    } else {
      NotificationManager.warning("Please input donation amount!");
    }
  };

  const onCopyAddress = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const compressAddress = (account) => {
    if (account) {
      let accountStr = account.toString();
      
      return  accountStr.substring(0, 5) +
          "..." +
          accountStr.substring(accountStr.length - 4, accountStr.length)          
    } else {
      return "";
    }
  }

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background:
              colorMode == null || colorMode == "light" ? "white" : "black",
          }}
        >
          <div
            className="loader"
            style={{
              backgroundImage:
                colorMode == null || colorMode == "light"
                  ? `url('/images/loader-light.gif')`
                  : `url('/images/loader-dark.gif')`,
            }}
          ></div>
        </div>
      ) : (
        <div className=" dark:bg-slate-900">
          <Header />

          <section className="container flex flex-col md:flex-row md:py-20 md:space-x-8 px-4 lg:space-x-14">
            <div className="flex-1">
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={`${
                  chains[chainId?.toString()]?.blockScanUrl
                }address/${id}`}
              >
                <div className="flex items-center space-x-2 cursor-pointer">
                  <h3 className=" dark:text-[#FFFFFF] text-[#150638]">
                    View on Etherscan{" "}
                  </h3>
                  <svg
                    width="23"
                    height="24"
                    viewBox="0 0 23 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.3056 1.85137L5.4221 0.410091L2.52792 3.20899L8.7959 10.7282L0.113356 19.1249L3.97933 23.7625L12.6619 15.3658L18.9298 22.885L21.824 20.0861L22.3056 1.85137Z"
                      fill="#09C9E3"
                    />
                  </svg>
                </div>
              </a>

              <img
                className="rounded-3xl w-full md:h-[336px] my-4"
                src={`${backendURL}/${summary[7]}` || ""}
                alt=""
              />

              <div>
                <h2 className="dark:text-[#FFFFFF] text-[#150638] font-semibold text-xl">
                {summary[5] || ""}
                </h2>

                <p className="dark:opacity-100 mt-2 dark:text-[#FFFFFF] opacity-70 text-base">
                  Description
                </p>

                <p className="dark:opacity-100 dark:text-[#FFFFFF] opacity-70 text-lg md:text-xl">
                { parse(summary[6] || "") || ""}
                </p>
              </div>

              <div className="my-4 flex items-center space-x-3">
              {
                summary[13] !== "" ?
                <div className="mx-2" >
                  <a href={`${summary[13]}`} target="_blank" rel="noreferrer" >
                    <img src="/images/icons/github.png" style={{ width:"32px", height:"32px", cursor:"pointer" }} alt="githubicon" />
                  </a>
                </div>
                : <></>
              }
              {
                summary[14] !== "" ?
                <div className="mx-2" >
                  <a href={`${summary[14]}`} target="_blank" rel="noreferrer" >
                    <img src="/images/icons/telegram.png" style={{ width:"32px", height:"32px", cursor:"pointer" }} alt="telegramicon" />
                  </a>
                </div>
                : <></>
              }                    
              {
                summary[15] !== "" ?
                <div className="mx-2" >
                  <a href={`${summary[15]}`} target="_blank" rel="noreferrer" >
                    <img src="/images/icons/twitter.png" style={{ width:"32px", height:"32px", cursor:"pointer" }} alt="twittericon" />
                  </a>
                </div>
                : <></>
              }
              </div>

              <div className="my-6 text-[#000000] space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-5">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.6429 6.5H8V6C8 3.79086 9.79086 2 12 2H18C20.2091 2 22 3.79086 22 6V12C22 14.2091 20.2091 16 18 16H17.5V11.3571C17.5 8.67462 15.3254 6.5 12.6429 6.5ZM6 22H12C14.2091 22 16 20.2091 16 18V12C16 9.79086 14.2091 8 12 8H6C3.79086 8 2 9.79086 2 12V18C2 20.2091 3.79086 22 6 22ZM12.4939 12.4356C12.8056 12.7083 12.8372 13.1822 12.5644 13.4939L9.69452 16.7738C9.07783 17.4786 8.01558 17.5729 7.2843 16.9879L5.53148 15.5857C5.20803 15.3269 5.15559 14.8549 5.41435 14.5315C5.6731 14.208 6.14507 14.1556 6.46852 14.4144L8.22134 15.8166C8.32581 15.9002 8.47756 15.8867 8.56566 15.786L11.4356 12.5061C11.7083 12.1944 12.1821 12.1628 12.4939 12.4356Z"
                        className="dark:fill-[#fff] fill-[#080D0E]"
                      />
                    </svg>
                  </div>
                  <div className="bg-[#FFFFFF] flex items-center justify-between flex-1 rounded-md p-2">
                    <h2>Minumum Contribution Amount</h2>
                    <h2>{
                          summary[0] > 0
                            ? globalWeb3?.utils.fromWei(summary[0], "ether")
                            : "0"
                        } {chains[chainId?.toString()]?.nativeCurrency}</h2>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-5">
                    <svg
                      width="15"
                      height="23"
                      viewBox="0 0 15 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.03125 0V8.31563L14.0597 11.4562L7.03125 0Z"
                        className="dark:fill-[#fff] fill-[#080D0E]"
                      />
                      <path
                        d="M7.02937 0L0 11.4562L7.02937 8.31563V0Z"
                        className="dark:fill-[#fff] fill-[#080D0E]"
                      />
                      <path
                        d="M7.03125 16.8446V22.495L14.0644 12.7646L7.03125 16.8446Z"
                        className="dark:fill-[#fff] fill-[#080D0E]"
                      />
                      <path
                        d="M7.02937 22.4953V16.8441L0 12.765L7.02937 22.4953Z"
                        className="dark:fill-[#fff] fill-[#080D0E]"
                      />
                      <path
                        d="M7.03125 15.5371L14.0597 11.4561L7.03125 8.31738V15.5371Z"
                        className="dark:fill-[#fff] fill-[#080D0E]"
                      />
                      <path
                        d="M0 11.4552L7.02937 15.5361V8.31641L0 11.4552Z"
                        className="dark:fill-[#fff] fill-[#080D0E]"
                      />
                    </svg>
                  </div>
                  <div className="bg-[#FFFFFF] flex flex-col flex-1 rounded-md p-2">
                    <div>Creator’s wallet address</div>
                    <div>{summary[4] || ""}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-5">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.6429 6.5H8V6C8 3.79086 9.79086 2 12 2H18C20.2091 2 22 3.79086 22 6V12C22 14.2091 20.2091 16 18 16H17.5V11.3571C17.5 8.67462 15.3254 6.5 12.6429 6.5ZM6 22H12C14.2091 22 16 20.2091 16 18V12C16 9.79086 14.2091 8 12 8H6C3.79086 8 2 9.79086 2 12V18C2 20.2091 3.79086 22 6 22ZM12.4939 12.4356C12.8056 12.7083 12.8372 13.1822 12.5644 13.4939L9.69452 16.7738C9.07783 17.4786 8.01558 17.5729 7.2843 16.9879L5.53148 15.5857C5.20803 15.3269 5.15559 14.8549 5.41435 14.5315C5.6731 14.208 6.14507 14.1556 6.46852 14.4144L8.22134 15.8166C8.32581 15.9002 8.47756 15.8867 8.56566 15.786L11.4356 12.5061C11.7083 12.1944 12.1821 12.1628 12.4939 12.4356Z"
                        className="dark:fill-[#fff] fill-[#080D0E]"
                      />
                    </svg>
                  </div>
                  <div className="bg-[#FFFFFF] flex items-center justify-between flex-1 rounded-md p-2">
                    <h2>Total Approvers</h2>
                    <h2>{summary[3] || 0}</h2>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-5">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.6429 6.5H8V6C8 3.79086 9.79086 2 12 2H18C20.2091 2 22 3.79086 22 6V12C22 14.2091 20.2091 16 18 16H17.5V11.3571C17.5 8.67462 15.3254 6.5 12.6429 6.5ZM6 22H12C14.2091 22 16 20.2091 16 18V12C16 9.79086 14.2091 8 12 8H6C3.79086 8 2 9.79086 2 12V18C2 20.2091 3.79086 22 6 22ZM12.4939 12.4356C12.8056 12.7083 12.8372 13.1822 12.5644 13.4939L9.69452 16.7738C9.07783 17.4786 8.01558 17.5729 7.2843 16.9879L5.53148 15.5857C5.20803 15.3269 5.15559 14.8549 5.41435 14.5315C5.6731 14.208 6.14507 14.1556 6.46852 14.4144L8.22134 15.8166C8.32581 15.9002 8.47756 15.8867 8.56566 15.786L11.4356 12.5061C11.7083 12.1944 12.1821 12.1628 12.4939 12.4356Z"
                        className="dark:fill-[#fff] fill-[#080D0E]"
                      />
                    </svg>
                  </div>
                  <div className="bg-[#FFFFFF] flex items-center justify-between flex-1 rounded-md p-2">
                    <h2>Total Requests</h2>
                    <h2>{summary[2] || 0}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="md:mt-10">
                <div className=" flex justify-between" >
                  <h3 className=" dark:text-[#FFFFFF] text-lg text-[#150638]">
                    Campaign Balance
                  </h3>
                  <h3 className=" dark:text-[#FFFFFF] text-lg text-[#150638]">
                    {
                    Number(globalWeb3?.utils?.fromWei(summary[8]?.toString() || "0", "ether").toString()) <= Number(globalWeb3?.utils?.fromWei(summary[1]?.toString() || "0", "ether").toString())? 
                    "Target Completed" : ""
                    }
                  </h3>
                </div>

                <div className="relative rounded-md overflow-hidden">
                  <input
                    className="w-full z-50 h-2 rounded-md my-3 range"
                    onChange={() => {}}
                    value={
                      summary[1] >= 0
                        ? globalWeb3?.utils?.fromWei(summary[1]?.toString(), "ether").toString()
                        : "0"
                    }
                    type="range"
                    min="1"
                    max={
                      summary[8] >= 0
                        ? globalWeb3?.utils?.fromWei(summary[8]?.toString(), "ether").toString()
                        : "0"
                    }
                  ></input>
                </div>

                <div className="flex items-center justify-between md:mb-5">
                  <h3 className=" dark:text-[#FFFFFF] text-lg text-[#150638]">
                  {summary[1] >= 0
                        ? globalWeb3?.utils.fromWei(summary[1], "ether")
                        : "0"}{" "}
                      {chains[chainId?.toString()]?.nativeCurrency}
                  </h3>

                  <h3 className=" dark:text-[#FFFFFF] text-lg text-[#150638]">
                  Target of{" "}
                      {summary[8] >= 0
                        ? globalWeb3?.utils.fromWei(summary[8], "ether")
                        : "0"}{" "}
                      {chains[chainId?.toString()]?.nativeCurrency}
                  </h3>
                </div>
              </div>

              <div className="my-3 flex items-center space-x-4">
                <input
                  placeholder="Enter amount"
                  type={"number"}                  
                  className="w-full rounded-xl inpBoxShadow outline-none border-none outline-none bg-[#FFFFFF] my-3 p-3"
                  onChange={(e) => {
                    onChangeDonationAmount(e.target.value);
                  }}
                />

                <button
                  onClick={() => {
                    setShowConfirmDlg(true);
                  }}
                  className="grantBtn  w-full p-3 rounded-xl font-bold text-xl text-[#FFFFFF]  bg-gradient-primary shadow-primary"
                >
                  Contribute
                </button>
              </div>
              <button className="grantBtn md:mt-10 w-full p-3 rounded-xl font-bold text-xl text-[#FFFFFF]  bg-gradient-primary shadow-primary"
                onClick={() => {
                  history(`/requests/${id}`);
                }}
              >
                View Withdrawal Requests
              </button>

              <div className="bg-[#75F7FFB5] w-full rounded-xl py-3 my-10 flex space-x-4 px-8 items-stretch">
                <div className="bg-[#006ED4] w-2 h-content rounded-full"></div>
                <p className="text-[#150638] text-sm md:text-base lg:text-xl">
                  Click the button below to see how funds are being used and if
                  you are a contributor, you can also approve the withdrawal
                  request.
                </p>
              </div>
            </div>
          </section>

          {showConfirmDlg && (
            <>
              <section className="fixed top-0 left-0 bottom-0 right-0 z-50 flex items-center justify-center">
                <div className="max-w-md p-3 md:w-[384px] mx-4 border-2 border-[#00FBFF] bg-[#FFFFFF] rounded-2xl p-4">
                  <img
                    className="w-full"
                    src={
                      `${backendURL}/${summary[7]}` || ""
                    }
                  />

                  <div className="my-4">
                    <h4 className="font-bold text-base">
                      Grant title - {summary[5] || ""}
                      <br />
                      Creator - {compressAddress(summary[4]) || ""}
                    </h4>
                    <span className="bg-[#000000] rounded-md p-1 ">
                      <span className="gT">{summary[11] || ""}</span>
                    </span>
                    <div className="mx-6 my-4">
                      {
                        ((chainId === OPTIMISTIC_CHAIN_ID || chainId === OPTIMISTIC_NETWORK_ID) || (chainId === GOERLI_CHAIN_ID || chainId === GOERLI_NETWORK_ID)) && 
                        <div className="flex items-center justify-between text-[#9FA1A3]">
                          <h3>OP Reward </h3>
                          <h3>0.03 OP</h3>
                        </div>
                      }

                      <div className="flex items-center justify-between text-[#000000]">
                        <h3>GivePOINTS </h3>
                        <h3>{gpAmount} GP</h3>
                      </div>

                      <div className="flex items-center justify-between text-[#000000]">
                        <h3>Total Donation </h3>
                        <h3> {Number(globalWeb3?.utils?.fromWei(summary[1]?.toString() || "0"))  + Number(donationAmount)} {chains[chainId?.toString()]?.nativeCurrency}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3 my-2">
                    <button
                      onClick={() => {
                        setShowConfirmDlg(false);
                      }}
                      className="py-1 rounded-md border border-[#D0D5DD] flex-1"
                    >
                      Cancel
                    </button>
                    <button className="py-1 rounded-md bg-[#000000] flex-1  bg-gradient-primary shadow-primary"
                     onClick={() => {onClickContribute()}}
                    >
                      <span className="text-[#ffffff]">Contribute</span>
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {popup ? (
            <>
              <section className="fixed top-0 left-0 z-50 flex items-center justify-center w-full min-h-screen popup">
                <div className="popup-other">
                  <div className="container">
                    <div className="mx-auto connect-popup">
                      <div className="flex items-center justify-between px-6 py-6 popup-head">
                        <div
                          className="cursor-pointer closebtn"
                          onClick={() => {
                            setPopup(!popup);
                            history("/");
                          }}
                        >
                          <img
                            src="/images/closebtn.png"
                            alt="close"
                            className="ml-auto"
                          />
                        </div>
                      </div>
                      <div className="px-3 text-center">
                        <div className="flex justify-center">
                          <img
                            src="/images/casual.png"
                            alt="casual"
                            className="mx-auto"
                          />
                        </div>
                        <h6 className="mt-3 mb-1 text-sm font-bold text-white md:text-2xl">
                          Thank you for contributing to this campaign!
                        </h6>
                        <p className="mb-5 text-xs text-white md:text-lg">
                          You successfully donated{" "}
                          {donationAmount >= 0 ? donationAmount : "0"}{" "}
                          {chains[chainId?.toString()]?.nativeCurrency}{" "}
                        </p>
                        <div className="flex w-11/12 mx-auto md:w-8/12 input-group">
                          <input
                            type="text"
                            disabled
                            id="website-admin"
                            className="flex-1 block w-full min-w-0 px-5 py-3 text-xs text-gray-900 placeholder-gray-800 border border-gray-300 rounded-none rounded-l-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Share your success on Twitter"
                          />
                          <CopyToClipboard
                            text={`${window.location.origin}/campaign/${id}`}
                            onCopy={onCopyAddress}
                          >
                            <button className="inline-flex items-center px-4 py-3 text-sm font-medium text-white border-0 border-r-0 bg-light-blue rounded-r-xl md:px-9">
                              {copied ? "Copied" : "Share"}
                            </button>
                          </CopyToClipboard>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            ""
          )}

          {donatingPopup ? (
            <>
              <section className="fixed top-0 left-0 z-50 flex items-center justify-center w-full min-h-screen popup">
                <div className="popup-other">
                  <div className="container">
                    <div className="mx-auto donating-popup">
                      <div className="px-3 text-center">
                        <h6 className="mt-3 mb-1 text-sm font-bold text-white md:text-2xl">
                          Donating...Please wait.
                        </h6>
                        <div className="flex justify-center">
                          <img
                            src="/images/donating_spin.png"
                            alt="casual"
                            className="donating_spin"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            ""
          )}

          <UserFooter />
        </div>
      )}
    </>
  );
}
