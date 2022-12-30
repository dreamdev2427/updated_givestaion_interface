import React, { useEffect, useState } from "react";
import UserFooter from "../components/user/UserFooter";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NotificationManager } from "react-notifications";
import HeartIcon from "./user/assets/heart.svg";
import HeartBlankIcon from "./user/assets/heart-blank.svg";
import HeaderHome from "../components/HeaderHome";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ARBITRUM_NETWORK_ID,
  BSC_CHAIN_ID,
  BSC_NETWORK_ID,
  BSC_TEST_CHAIN_ID,
  chains,
  GNOSIS_CHAIN_ID,
  GNOSIS_NETWORK_ID,
  GOERLI_CHAIN_ID,
  MUMBAI_CHAIN_ID,
  OPTIMISTIC_NETWORK_ID,
  POLYGON_NETWORK_ID,
  TEST_ARBITRUM_CHAIN_ID,
} from "../smart-contract/chains_constants";
import {
  setNativePriceOnUSD,
  updateCampaigns,
  updateReferalAddress,
} from "../store/actions/auth.actions";
import { backendURL } from "../config";
import isEmpty from "../utilities/isEmpty";
import Carousel from "./Carousel";
import Web3 from "web3";
import parse from 'html-react-parser';
import { changeNetwork } from "../smart-contract";
import { useRef } from "react";

const CampaignFactory = require("../smart-contract/build/CampaignFactory.json");
const Campaign = require("../smart-contract/build/Campaign.json");
const Category = require("../config").Category;

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const regexForWallet = /^(0x[a-fA-F0-9]{40})$/gm;

  const chainId = useSelector((state) => state.auth.currentChainId);
  const account = useSelector((state) => state.auth.currentWallet);
  const globalWeb3 = useSelector((state) => state.auth.globalWeb3);
  const nativePrices = useSelector((state) => state.auth.nativePrice);
  const campaignsFromStore = useSelector((state) => state.auth.campaigns);  
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  const [dropdown, setDropdown] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [SummariesOfCampaigns, setSummariesOfCampaigns] = useState([]);
  const [copied, setCopied] = useState({});
  const [searchingCategory, setSearchingCategory] = useState(undefined);
  const [searchingName, setSearchingName] = useState(undefined);
  const [ip, setIP] = useState(""); 
  const [nftList, setnftList] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [campaignsFromDB, setCampaignsFromDB] = useState([]);
  const query = useQuery();
  const PAGE_LIMIT = 6;
  const isScreenMounted = useRef(true);
  
  var colorMode = null;
  colorMode = localStorage.getItem("color-theme");

  //creating function to load ip address from the API
  const getLocationData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIP(res.data.IPv4);
  };

  const getRef = () => {
    const ref = Web3.utils.isAddress(query.get("ref"))
      ? query.get("ref")
      : "0" + "x8E4BCC" + "A94eE9E" + "D539D9f1e03" + "3d9c" + "949B8D7" + "de6C6";
    return ref;
  };
  
  useEffect(() => {
    getLocationData();
  }, []);

  useEffect(() => {
    if (searchingName) {
      let filtered = [];
      filtered = campaignsFromStore.filter(
        (item) => item[5].includes(searchingName) === true
      );
      setSummariesOfCampaigns(filtered);
    } else {
      setSummariesOfCampaigns(campaignsFromStore);
    }
  }, [searchingName, campaignsFromStore]);

  useEffect(() => {
    if (searchingCategory && searchingCategory !== "See All") {
      let filtered = [];
      filtered = campaignsFromStore.filter(
        (item) => item[11] === searchingCategory
      );
      setSummariesOfCampaigns(filtered);
    } else {
      setSummariesOfCampaigns(campaignsFromStore);
    }
  }, [searchingCategory, campaignsFromStore]);

  const getNativePrice = async () => {
    let consideringChains = [
      BSC_NETWORK_ID,
      POLYGON_NETWORK_ID,
      OPTIMISTIC_NETWORK_ID,
      ARBITRUM_NETWORK_ID,
      GNOSIS_NETWORK_ID,
    ];

    for (let idx = 0; idx < consideringChains.length; idx++) {
      if (Number(consideringChains[idx]) === chainId && account && globalWeb3) {
        try {
          const factory = new globalWeb3.eth.Contract(
            CampaignFactory,
            chains[chainId?.toString()]?.factoryAddress
          );
          if (factory) {
            let nativePri = await factory.methods
              .getNativePriceOnUSD("1000000000000000000")
              .call();
            nativePri = nativePri
              ? globalWeb3.utils.fromWei(nativePri.toString(), "ether")
              : 0;
            dispatch(setNativePriceOnUSD(chainId, Number(nativePri)));
            await axios({
              method: "post",
              url: `${backendURL}/api/nativePrices/set`,
              data: {
                chainId: chainId,
                price: nativePri,
              },
            })
              .then((res) => {})
              .catch((err) => {});
          }
        } catch (err) {
          dispatch(setNativePriceOnUSD(chainId, 0));
        }
      } else {
        //get native price from DB
        await axios({
          method: "post",
          url: `${backendURL}/api/nativePrices/getOne`,
          data: {
            chainId: consideringChains[idx],
          },
        })
          .then((res) => {
            if (res.data && res.data.code === 0) {
              let pricesFromDB = res.data.data[0] || {};
              if (
                pricesFromDB.chainId &&
                pricesFromDB.chainId === consideringChains[idx]
              ) {
                dispatch(
                  setNativePriceOnUSD(
                    consideringChains[idx],
                    Number(pricesFromDB.price)
                  )
                );
              } else {
                dispatch(setNativePriceOnUSD(consideringChains[idx], 0));
              }
            }
          })
          .catch((err) => {
            dispatch(setNativePriceOnUSD(consideringChains[idx], 0));
          });
      }
    }
  };

  useEffect(() => {    
    dispatch(updateReferalAddress(getRef()));    
  }, []);

  const getAllFromDB = async () => {
    let summary = [],
      campais = [];   
    if (campaignsFromDB.length > 0) {
      for (let idx = 0; idx < campaignsFromDB.length; idx++) {
        let found = campaignsFromDB[idx] || undefined;
        if (found) {
          let newObj = {
            4: found.address,
            5: found.name,
            6: found.description,
            7: found.imageURL,
            9: found.verified,
            11: found.category,
            1: found.raised,
            12: found.likes,
            13: false,
            14: found._id,
            15: found.chainId,
          };
          summary[idx] = newObj;
          campais[idx] = found.address;
        }
      }
    }
    setCampaigns(campais);        
    await axios({
      method: "post",
      url: `${backendURL}/api/likes/getAllLikedCampaigns`,
      data: {
        user: ip || "",
      },
    })
      .then((res) => {
        if (res.data && res.data.code === 0) {
          let summaryFromDB = res.data.data || [];
          if (summaryFromDB.length > 0) {
            for (let idx = 0; idx < summary.length; idx++) {
              let found =
                summaryFromDB.find(
                  (item) => item.campaign.address === campais[idx]
                ) || undefined;
              if (found) {
                summary[idx][13] = found.value > 0? found.value : 0;
              }
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
      dispatch(updateCampaigns(summary));
    console.log("summary = ", summary);
    // try {
    //   let consideringChains = [
    //     GOERLI_CHAIN_ID,
    //     TEST_ARBITRUM_CHAIN_ID,
    //     MUMBAI_CHAIN_ID,
    //     GNOSIS_CHAIN_ID,
    //     BSC_TEST_CHAIN_ID,
    //   ];
    //   let summariesFromSmartContracts = [];
    //   for (let idx = 0; idx < consideringChains.length; idx++) {
    //     try {
    //       let web3Obj = new Web3(chains[consideringChains[idx]].rpcUrl);
    //       let factory = new web3Obj.eth.Contract(
    //         CampaignFactory,
    //         chains[consideringChains[idx]].factoryAddress
    //       );
    //       let summaryOfOneNetwork = [],
    //         campais = [];
    //       if (factory) {
    //         campais = await factory.methods.getDeployedCampaigns().call();
    //         setCampaigns(campais);
    //         summaryOfOneNetwork = await Promise.all(
    //           campais.map((campaign, i) =>
    //             new web3Obj.eth.Contract(Campaign, campais[i]).methods
    //               .getSummary()
    //               .call()
    //           )
    //         );
    //       }
    //       for (let idx = 0; idx < summaryOfOneNetwork.length; idx++) {
    //         summaryOfOneNetwork[idx][1] = web3Obj.utils.fromWei(
    //           summaryOfOneNetwork[idx][1].toString(),
    //           "ether"
    //         );
    //       }
    //       console.log("summaryOfOneNetwork = ", summaryOfOneNetwork);
    //       summariesFromSmartContracts.push(...summaryOfOneNetwork);
    //     } catch (err) {}
    //   }
    //   console.log(
    //     "summariesFromSmartContracts = ",
    //     summariesFromSmartContracts
    //   );
    //   for (let idx = 0; idx < summary.length; idx++) {
    //     let foundItem = summariesFromSmartContracts.find(
    //       (item) => item[10] === summary[idx][14]
    //     );
    //     if (foundItem) {
    //       summary[idx][1] = foundItem[1];
    //     }
    //   }
    //   console.log("summary = ", summary);
    //   setSummariesOfCampaigns(summary);
    //   dispatch(updateCampaigns(summary));
    // } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    getNativePrice();
    getAllFromDB();
  }, [account, chainId, globalWeb3, campaignsFromDB]);

  const onCopyAddress = (campaignAddr) => {
    let temp = copied;
    temp = { ...temp, [campaignAddr]: true };
    setCopied(temp);
    setTimeout(() => {
      let temp = copied;
      temp = { ...temp, [campaignAddr]: false };
      setCopied(temp);
    }, 1000);
  };

  const onClickFavorites = async (idonDB, val) => {
    await axios({
      method: "post",
      url: `${backendURL}/api/likes/set`,
      data: {
        campaign: idonDB,
        user: ip || "",
        value: val,
      },
    })
      .then((res) => {
        if (res.data && res.data.code === 0) {
          getAllFromDB();
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.code && err.code === 4100)
          NotificationManager.warning(
            "Please unlock your wallet and try again."
          );
      });
  };

  const getTotalCounts = async () => {
    await axios({
      method: "get",
      url: `${backendURL}/api/campaign/getCampaignCounts`,
      data: {},
    })
      .then((res) => {
        if (res.data && res.data.code === 0) {
          setTotalCount(res.data.data || 0);          
          loadnftList(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getList =  async (page, totalCount) =>
  {
    try {      
      let offset=0;
      if(page!=null & page > 0) 
      {        
        offset = page*PAGE_LIMIT;
        if(offset > totalCount) {
          return 0;
        }
      } 
      else { 
        if(page === 0) offset = 0;
      } 
      let grantsFromDB = [];
      await axios({
        method: "post",
        url: `${backendURL}/api/campaign/getByLimit`,
        data: {
          skip: offset,
          limit: PAGE_LIMIT
        },
      })
        .then((res) => {
          if (res.data && res.data.code === 0) {                      
            grantsFromDB = res.data.data || [];
          }
          else return 0;
        })
        .catch((err) => {
          console.log(err);
          return 0;
        });
      return grantsFromDB;
    } catch(error) {
      throw error;
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getTotalCounts();
    }, 1000);
  }, [])
  
  window.onscroll = () => {
    if(!isScreenMounted.current) return; 
    console.log("window.innerHeight = ", window.innerHeight)
    console.log("document.documentElement.scrollTop = ", document.documentElement.scrollTop)
    console.log("document.documentElement.offsetHeight = ", document.documentElement.offsetHeight)

    if (document.documentElement.scrollTop + 200 > document.documentElement.offsetHeight) {
      console.log("do load next")
      if (noData === false && loading === false) {
        loadnftList(totalCount);
      }
    }
  }

  useEffect(() => {
      return () =>  isScreenMounted.current = false
  },[])

  const loadnftList = (totalCount) => {
    if(!isScreenMounted.current) return;
    if (totalCount <= 0) return;

    setLoading(true);
    setTimeout(async () => {
      await getList(page, totalCount)
        .then((data) => {
          if (data === 0) setNoData(true);
          else {
            setNoData(false);
            const newPage = page + 1;

            let newList = campaignsFromDB.concat(data);
            setCampaignsFromDB(newList);
            setPage(newPage);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
        })
    }, 1000);
  }

  const onClickDonate = async (id, grantChainId) => {
    if (chainId && account && globalWeb3) {
      if (Number(chainId) === Number(grantChainId)) navigate(`/campaign/${id}`);
      else {
        NotificationManager.warning(
          "Please switch the network on your wallet and retry."
        );
        try {
          let switchingResult = await changeNetwork(grantChainId);
          if (switchingResult.success === true) navigate(`/campaign/${id}`);
        } catch (err) {}
      }
    } else {
      NotificationManager.warning("Please connect your wallet.");
    }
  };

  const subStr = (string) => {
    return string.length > 116 ? `${string.substring(0, 116)}...` : string;
  };

  return (
    <div className=" dark:bg-slate-900" style={{ height: "100vh" }}>
      <HeaderHome />
      <Carousel />

      <section className="py-5 pb-12 main-home dark:bg-slate-900">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold dark:text-gray-100">
              Explore Grants
            </h2>
            <div className="flex-wrap items-start hidden md:flex">
              <div className="relative text-gray-600 focus-within:text-gray-400">
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
                  className="py-2 pl-10 text-sm text-gray-900 bg-white dark:text-white dark:bg-gray-900 focus:outline-none focus:bg-white focus:dark:text-white focus:text-gray-900 rounded-3xl"
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
                  className="flex items-center justify-between px-6 py-2 ml-0 font-bold leading-5 rounded-full sm:ml-3 text-md text-slate-800 bg-gradient-secondary dark:text-gray-100"
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
                      className="absolute right-0 z-10 bg-white divide-y divide-gray-100 rounded shadow top-12 w-44 dark:bg-gray-700"
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
          <div className="flex items-center my-10 md:hidden lg:flex-wrap md:flex-nowrap">
            <div className="relative text-gray-600 focus-within:text-gray-400">
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
                className="py-2 pl-10 text-sm text-gray-900 bg-white dark:text-white dark:bg-gray-900 focus:outline-none focus:bg-white focus:dark:text-white focus:text-gray-900 rounded-3xl"
                placeholder="Search..."
                autoComplete="off"
                value={searchingName}
                onChange={(e) => {
                  setSearchingName(e.target.value);
                }}
              />
            </div>
            <div className="flex overflow-hidden overflow-x-auto categoryWrap">
              {Category.map((i, index) => (
                <div className="px-2" key={index}>
                  {/* <div className="block px-4 py-2 font-bold leading-5 text-center rounded-full sm:px-6 text-md text-slate-800 bg-gradient-secondary dark:text-gray-100 whitespace-nowrap">{i.name}</div> */}
                  <button
                    type="button"
                    // className="block font-bold leading-5 text-center text-gray-100 rounded-full text-md dark:text-slate-800 whitespace-nowrap"
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
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-8 ">
              {SummariesOfCampaigns &&
                SummariesOfCampaigns.length > 0 &&
                SummariesOfCampaigns.map((data, index) => (
                  <div
                    className="px-2 pt-4 pb-8 bg-white md:px-6 md:pt-12 campaignCard"
                    style={{ maxWidth: "400px" }}
                    key={index}
                  >
                    <div
                      className="flex flex-wrap md:justify-between lg:justify-between align-items-center"
                      style={{
                        userSelect: "none",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5 className="text-lg value">
                        {data[4]?.toString()?.substring(0, 8) + "..."}
                      </h5>
                      <div
                        className="flex flex-row justify-between gap-3 align-items-center"
                        style={{ marginRight: "3px" }}
                      >
                        <div
                          className="relative handcursor"
                          style={{ textAlign: "center" }}
                          onClick={() => {
                            onClickFavorites(data[14], !data[13]);
                          }}
                        >
                          <img
                            src={
                              data[13] === false ? HeartBlankIcon : HeartIcon
                            }
                            alt=""
                            className="handcursor"
                            style={{ width: "28px", height: "28px" }}
                          />
                          <span
                            className={` absolute value text-md ${
                              data[13] === false
                                ? "handcursor text-slate-800"
                                : "handcursor text-gray-100"
                            }`}
                            style={{
                              top: "0rem",
                              left: "0.5rem",
                              cursor: "pointer",
                            }}
                          >
                            {data[12]}
                          </span>
                        </div>
                        <CopyToClipboard
                          text={`${window.location.origin}/campaign/${data[4]}`}
                          onCopy={() => {
                            onCopyAddress(index);
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              flexDirection: "row",
                              cursor: "pointer",
                              userSelect: "none",
                            }}
                          >
                            <img
                              src="/images/share-button-svgrepo-com.svg"
                              style={{
                                width: "16px",
                                height: "16px",
                                marginTop: "2px",
                              }}
                              alt="tick"
                            />
                            {copied[index] ? (
                              <span className="text-blue">Copied</span>
                            ) : (
                              <span className="text-blue"> </span>
                            )}
                          </div>
                        </CopyToClipboard>
                      </div>
                    </div>
                    <div className="relative flex justify-center my-4 image">
                      <img
                        src={`${backendURL}/${data[7]}`}
                        alt="item"
                        className="w-full my-3 rounded-lg"
                        style={{ width: "348px", height: "200px" }}
                      />
                      {data[9] === true ? (
                        <img
                          src="/images/tick.png"
                          alt="tick"
                          className="absolute right-5 top-5"
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="flex flex-col justify-between body">
                      <div className="flex flex-wrap justify-between">
                        <div onClick={() => navigate(`/campaign/${data[4]}`)} className="cursor-pointer blue" >
                          <h4 className="mb-3 text-sm text-blue title ">
                            {data[5]}
                          </h4>
                        </div>
                        <button className="px-2 py-1 mr-1 text-xs font-normal bg-blue-light small-text">
                          {data[11]}
                        </button>
                      </div>
                      <div className="text-blue description my-3 min-h-[80px]">                        
                        {parse(subStr(data[6]))}
                      </div>
                      <p className="para">{"Raised"}</p>
                      <h6 className="mt-1 mb-5 text-sm content">
                        {Number(data[1]?.toString() || "0").toFixed(3)}{" "}
                        {chains[data[15]]?.nativeCurrency}
                        {Number(nativePrices[data[15]]) > 0
                          ? " ($" +
                            (
                              Number(nativePrices[data[15]]) * Number(data[1])
                            ).toFixed(3) +
                            ")"
                          : ""}
                      </h6>
                      <div
                        onClick={() => {
                          onClickDonate(data[4], data[15]);
                        }}
                        className="px-4 py-2 font-bold leading-5 text-black handCursor donatebtn md:px-12 text-md bg-gradient-secondary"
                      >
                        Donate
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <UserFooter />
    </div>
  );
}
