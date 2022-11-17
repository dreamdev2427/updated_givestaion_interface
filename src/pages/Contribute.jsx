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
import { chains } from "../smart-contract/chains_constants";
import parse from 'html-react-parser';
const CampaignFactory = require("../smart-contract/build/CampaignFactory.json");
const Campaign = require("../smart-contract/build/Campaign.json");

export default function Contribute() {
  const history = useNavigate();
  const [summary, setSummary] = useState({});
  const [popup, setPopup] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);
  const [campaignIdOnDB, setCampaignIdOnDB] = useState(null);
  const [copied, setCopied] = useState(false);
  const [donatingPopup, showDonatingPopup] = useState(false);

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
      alert(0)
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
              alert(summaryFromDB)
              if (summaryFromDB !== undefined) {
                summa[5] = summaryFromDB.name;
                summa[6] = summaryFromDB.description;
                summa[7] = summaryFromDB.imageURL;
                summa[9] = summaryFromDB.verified;
                summa[11] = summaryFromDB.category;
                summa[12] = summaryFromDB.raised;
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
    if (donationAmount > 0) {
      if (globalWeb3 && account) {
        showDonatingPopup(true);
        try {
          await new globalWeb3.eth.Contract(Campaign, id).methods
            .contribute(refAddr)
            .send({
              from: account,
              gas: 3000000,
              value: globalWeb3.utils.toWei(donationAmount.toString(), "ether"),
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

          <section className="pt-24 pb-16">
            <div className="container">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="left">
                  <p className="flex items-center text-sm dark:text-gray-100">
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href={`${
                        chains[chainId?.toString()]?.blockScanUrl
                      }address/${id}`}
                    >
                      View on block scan website
                    </a>
                    <span className="ml-2">
                      <img
                        className="w-2/3"
                        src="/images/blue-arrow.png"
                        alt="blue arrow"
                      />
                    </span>
                  </p>
                  <img
                    className="w-full my-3 rounded-3xl"
                    src={
                      `${backendURL}/${summary[7]}` || "/images/avengers.png"
                    }
                    alt="avengers"
                  />
                  <h4 className="mt-12 text-lg font-bold dark:text-gray-100">
                    {summary[5] || ""}
                  </h4>
                  <h6 className="my-2.5 text-md dark:text-gray-100">
                    Description
                  </h6>
                  <p className="mb-3 dark:text-gray-100">
                    { parse(summary[6] || "") || ""}
                  </p>
                  <div className="flex flex-wrap items-end mt-6">
                    <div className="w-full sm:w-3/12 md:3/12">
                      <label className="block mb-3 text-sm text-center dark:text-gray-100">
                        Minimum <br /> Contribution Amount
                      </label>
                      <input
                        type="text"
                        disabled
                        className="w-full px-6 py-3 bg-white border-0 rounded-lg focus:outline-none focus:ring-0 text-slate-800 shadow-secondary"
                        value={
                          summary[0] > 0
                            ? globalWeb3?.utils.fromWei(summary[0], "ether")
                            : "0"
                        }
                        onChange={() => {}}
                      />
                    </div>
                    <div className="w-full sm:w-8/12 md:8/12 sm:ml-5">
                      <label className="block mb-3 text-sm text-center dark:text-gray-100">
                        Creator’s wallet address
                      </label>
                      <input
                        type="text"
                        disabled
                        className="w-full px-6 py-3 bg-white border-0 rounded-lg focus:outline-none focus:ring-0 text-slate-800 shadow-secondary"
                        value={summary[4] || ""}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                  <div className="flex items-end mt-10">
                    <div className="w-full pr-4 sm:w-3/12 md:3/12">
                      <label className="block mb-5 text-sm text-center dark:text-gray-100">
                        Total Requests
                      </label>
                      <div className="w-16 mx-auto">
                        <input
                          type="text"
                          disabled
                          className="w-full px-6 py-5 bg-white border-0 rounded-lg focus:outline-none focus:ring-0 text-slate-800 shadow-secondary"
                          value={summary[2] || 0}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-3/12 md:3/12">
                      <label className="block mb-5 text-sm text-center dark:text-gray-100">
                        Total Approvers
                      </label>
                      <div className="w-16 mx-auto">
                        <input
                          type="text"
                          disabled
                          className="w-full px-6 py-5 bg-white border-0 rounded-lg focus:outline-none focus:ring-0 text-slate-800 shadow-secondary"
                          value={summary[3] || 0}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-0 right md:pl-12">
                  <h4 className="my-6 text-lg font-bold value dark:text-gray-100">
                    Grant Balance
                  </h4>
                  <div className="my-1 range">
                    <input
                      type="range"
                      name="range"
                      id="range"
                      min="0"
                      max={
                        summary[8] >= 0
                          ? globalWeb3?.utils
                              .fromWei(summary[8].toString(), "ether")
                              .toString()
                          : "0"
                      }
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-primary"
                      value={
                        summary[1] >= 0
                          ? globalWeb3?.utils
                              .fromWei(summary[1], "ether")
                              .toString()
                          : "0"
                      }
                      onChange={() => {}}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="my-6 text-lg value dark:text-gray-100">
                      {summary[1] >= 0
                        ? globalWeb3?.utils.fromWei(summary[1], "ether")
                        : "0"}{" "}
                      {chains[chainId?.toString()]?.nativeCurrency}
                    </h4>
                    <h4 className="my-6 text-lg value dark:text-gray-100">
                      Target of{" "}
                      {summary[8] >= 0
                        ? globalWeb3?.utils.fromWei(summary[8], "ether")
                        : "0"}{" "}
                      {chains[chainId?.toString()]?.nativeCurrency}
                    </h4>
                  </div>
                  <div className="mt-5 form">
                    <input
                      type="number"
                      className="w-full px-6 py-6 bg-white border-0 rounded-lg mb-7 focus:outline-none focus:ring-0 text-slate-800 shadow-secondary"
                      placeholder="Enter amount"
                      onChange={(e) => {
                        onChangeDonationAmount(e.target.value);
                      }}
                    />
                    <button
                      className="flex items-center justify-center w-full px-4 py-4 font-bold text-center text-white rounded-lg campaignbtn bg-gradient-primary shadow-primary"
                      onClick={() => {
                        onClickContribute();
                      }}
                    >
                      Contribute
                    </button>
                  </div>
                  <div className="px-3 py-2 rounded note mt-36 bg-primary mb-9">
                    <div className="border-l-4 border-blue-600">
                      <p className="pl-4 text-md">
                        Click the button below to see how funds are being used{" "}
                        <br />
                        and if you are a contributor, you can also approve{" "}
                        <br /> the withdrawal request.
                      </p>
                    </div>
                  </div>
                  <button
                    className="flex items-center justify-center w-full px-4 py-4 text-lg font-bold text-center text-white rounded-lg campaignbtn bg-gradient-primary shadow-primary"
                    onClick={() => {
                      history(`/requests/${id}`);
                    }}
                  >
                    View Withdrawal Requests
                  </button>
                </div>
              </div>
            </div>
          </section>

          {popup ? (
            <>
              {/* popup  */}
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
          {popup && <Confetti />}
        </div>
      )}
    </>
  );
}
