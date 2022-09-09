import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import DarkLightMode from "./DarkLightMode";
import Web3Modal from "web3modal";
import Web3 from "web3";
import WalletConnect from "@walletconnect/web3-provider";
import { useDispatch, useSelector } from "react-redux";
import { changeNetwork } from "../smart-contract";
import { INFURA_KEY } from "../config";
import {
  setConnectedChainId,
  setConnectedWalletAddress,
  updateGlobalWeb3,
} from "../store/actions/auth.actions";
import {
  OPTIMISTIC_CHAIN_ID,
  BSC_CHAIN_ID,
  ARBITRUM_CHAIN_ID,
  POLYGON_CHAIN_ID,
  GNOSIS_CHAIN_ID,
  BSC_NETWORK_ID,
  GNOSIS_NETWORK_ID,
  POLYGON_NETWORK_ID,
  ARBITRUM_NETWORK_ID,
  OPTIMISTIC_NETWORK_ID,
  BSC_TEST_CHAIN_ID,
  BSC_TEST_NETWORK_ID,
} from "../smart-contract/chains_constants";
import Alert from "../pages/Alert";

export const providerOptions = {
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: INFURA_KEY,
    },
  },
};

const web3Modal = new Web3Modal({
  network: "mainnet",
  cachProvider: true,
  theme: "dark",
  providerOptions,
});

export default function Header() {
  const [active, setActive] = useState(null);
  const [activeIcon, setActiveIcon] = useState("op.png");
  const [connected, setConnected] = useState(false);
  const [menu, setMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  const [connectPopup, setConnectPopup] = useState(false);
  const [provider, setProvider] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [compressedAccount, setCompressedAccount] = useState("");

  const account = useSelector((state) => state.auth.currentWallet);
  const chainId = useSelector((state) => state.auth.currentChainId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    if (account && chainId) {
      setConnected(true);
      setActiveNetwork(chainId);
    } else setConnected(false);
  }, [account, chainId]);

  const onClickConnectWallet = async () => {
    try {
      const provider = await web3Modal.connect();

      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const chainId = await web3.eth.getChainId();

      setProvider(provider);
      dispatch(updateGlobalWeb3(web3));
      if (accounts[0]) {
        dispatch(setConnectedWalletAddress(accounts[0]));
        setConnected(true);
      } else {
        dispatch(setConnectedWalletAddress(null));
        setConnected(false);
      }
      dispatch(setConnectedChainId(chainId));
      setActiveNetwork(chainId);
    } catch (error) {
      console.error(error);
      setConnected(false);
      dispatch(setConnectedWalletAddress(null));
    }
  };

  useEffect(() => {
    if (account) {
      let accountStr = account.toString();
      setCompressedAccount(
        accountStr.substring(0, 5) +
          "..." +
          accountStr.substring(accountStr.length - 4, accountStr.length)
      );
    } else {
      setCompressedAccount("");
    }
  }, [account]);

  const onClickDisconnect = async () => {
    try {
      await web3Modal.clearCachedProvider();
    } catch (e) {}
    setConnected(false);
    setActiveNetwork(null);
    setActive(null);
    dispatch(setConnectedChainId(null));
    dispatch(setConnectedWalletAddress(null));
  };

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        if (accounts[0]) {
          dispatch(setConnectedWalletAddress(accounts[0]));
          setConnected(true);
        } else {
          dispatch(setConnectedWalletAddress(null));
          setConnected(false);
        }
      };

      const handleChainChanged = (chainId) => {
        dispatch(setConnectedChainId(chainId));
        setActiveNetwork(chainId);
      };

      const handleDisconnect = () => {
        onClickDisconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, dispatch]);

  const setActiveNetwork = (chainId) => {
    switch (chainId && chainId.toString()) {
      default:
        break;
      case OPTIMISTIC_CHAIN_ID:
      case OPTIMISTIC_NETWORK_ID:
        setActive("Optimism");
        setActiveIcon("op.png");
        setPopup(false);
        break;
      case BSC_CHAIN_ID:
      case BSC_NETWORK_ID:
        setActive("Binance");
        setActiveIcon("protocol.png");
        setPopup(false);
        break;
      case ARBITRUM_CHAIN_ID:
      case ARBITRUM_NETWORK_ID:
        setActive("Arbitrum");
        setActiveIcon("symbol.png");
        setPopup(false);
        break;
      case POLYGON_CHAIN_ID:
      case POLYGON_NETWORK_ID:
        setActive("Polygon");
        setActiveIcon("group.png");
        setPopup(false);
        break;
      case GNOSIS_CHAIN_ID:
      case GNOSIS_NETWORK_ID:
        setActive("Gnosis");
        setActiveIcon("gnosis.png");
        setPopup(false);
        break;
      case BSC_TEST_CHAIN_ID:
      case BSC_TEST_NETWORK_ID:
        setActive("BSC Testnet");
        setActiveIcon("protocol.png");
        setPopup(false);
        break;
    }
  };

  const onClickChangeNetwork = async (chainId) => {
    try {
      let result = await changeNetwork(chainId);
      if (result && result.success === true) {
        dispatch(setConnectedChainId(chainId));
        setActiveNetwork(chainId);
      } else {
        // setAlertType("warning");
        // setAlertContent("Please check your wallet. Try adding the chain to Wallet first.");
        // setAlertTitle("Warning");
        // setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setAlertContent(error);
      setAlertTitle("Error");
      setShowAlert(true);
    }
  };
  const [isOptimisimOpen, setIsOptimisimOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex lg:hidden w-full items-center justify-between p-3 z-40  sticky left-0 right-0 top-0">
        {/* <img
          className=" cursor-pointer "
          src="./assets/icons/hamburger.svg"
          alt="hamburger"
        /> */}{" "}
        <Link to={"/"} className="flex lg:hidden items-center">
          <img
            className="w-20 h-20 object-contain"
            src="./images/logo.png"
            alt="logo"
          />
          <h2 className="font-medium text-2xl text-[#09080C] dark:text-[#fff]">
            GiveStation
          </h2>
        </Link>
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
            ? "left-0 bg-[#1F2937] lg:bg-transparent px-5"
            : "-left-80 hidden lg:flex"
        } absolute z-50 top-0 px-0 md:px-8 py-5 w-[320px] lg:static flex flex-col lg:flex-row  lg:bg-transparent h-full lg:w-full lg:items-center lg:justify-between lg:py-5 `}
      >
        <div className="flex px-8 md:hidden items-center justify-between">
          <div className="flex items-center">
            <img
              className="w-16 h-16 object-contain"
              src="./images/logo.png"
              alt="logo"
            />
            <h2 className="font-medium text-2xl text-[#fff]">
              GiveStation
            </h2>
          </div>
          <img
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="ml-5 lg:hidden cursor-pointer"
            src="../../assets/icons/close.svg"
            alt="close"
          />
        </div>
        <div className="md:space-y-3 lg:space-y-0 lg:space-x-3 flex flex-col  items-center lg:flex-row">
          <Link to={"/"} className="hidden lg:flex items-center">
            <img
              className="w-20 h-20 object-contain"
              src="./images/logo.png"
              alt="logo"
            />
            <h2 className="font-medium text-2xl text-[#09080C] dark:text-[#fff]">
              GiveStation
            </h2>
          </Link>
          <button className="text-left md:text-center hover:bg-[#00FBFF] hover:md:bg-[#09080C] md:bg-[#09080C] w-full lg:w-auto md:my-2 md:rounded-md py-2 px-4 shadow">
            <span className="gradient-text text-base">Grants</span>
          </button>

          <Link
            to="/hackathon"
            className=" hover:bg-[#00FBFF] hover:md:bg-[#09080C] md:bg-[#09080C] w-full lg:w-auto md:my-2 md:rounded-md py-2 px-4 shadow"
          >
            <span className="gradient-text text-base">Hackathons</span>
          </Link>
          <button className="text-left md:text-center hover:bg-[#00FBFF] hover:md:bg-[#09080C] md:bg-[#09080C] w-full lg:w-auto md:my-2 md:rounded-md py-2 px-4 shadow">
            <span className="gradient-text text-base">Governance</span>
          </button>
          <button></button>
        </div>
        <div className="px-8 md:px-0 mt-5 md:mt-0 space-y-3 lg:space-y-0 lg:space-x-3 flex flex-col lg:flex-row  lg:items-center">
          <div className="relative">
            <button
              onClick={() => {
                setIsOptimisimOpen(!isOptimisimOpen);
              }}
              className={`bg-[#1C1924] rounded-full w-full lg:w-auto flex justify-center md:justify-start items-center duration-300  ${
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
                  : "-top-[500px] hidden lg:block"
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
              {
                chainId && (chainId.toString() === OPTIMISTIC_CHAIN_ID || chainId.toString() === OPTIMISTIC_CHAIN_ID) ?
                <div className="flex my-5 items-center justify-between"
                >
                  <div className="flex items-center">
                    <img src="../../assets/images/op.png" alt="op" />
                    <span className="text-lg ml-3"> Optimism</span>
                  </div>                
                    <div className="w-3 h-3 bg-[#07D942] rounded-full"></div>
                </div>
                :
                <div className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg"
                  onClick={() => onClickChangeNetwork(OPTIMISTIC_CHAIN_ID) }>
                  <img
                    className="w-8 h-8 mr-3"
                    src="../../assets/images/op.png"
                    alt="optimism"
                  />{" "}
                  <h2 className="font-medium text-sm">Optimism</h2>
                </div>
              } 
              {
                chainId && (chainId.toString() === ARBITRUM_CHAIN_ID || chainId.toString() === ARBITRUM_NETWORK_ID) ?
                <div className="flex my-5 items-center justify-between"
                >
                  <div className="flex items-center">
                    <img src="../../assets/images/arbitrum.png" alt="op" />
                    <span className="text-lg ml-3"> Arbitrum</span>
                  </div>                
                    <div className="w-3 h-3 bg-[#07D942] rounded-full"></div>
                </div>
                :
                <div className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg"
                  onClick={() => onClickChangeNetwork(ARBITRUM_CHAIN_ID) }>
                  <img
                    className="w-8 h-8 mr-3"
                    src="../../assets/images/arbitrum.png"
                    alt="arbitrum"
                  />{" "}
                  <h2 className="font-medium text-sm">Arbitrum</h2>
                </div>
              }
              {
                chainId && (chainId.toString() === POLYGON_CHAIN_ID || chainId.toString() === POLYGON_NETWORK_ID) ?
                <div className="flex my-5 items-center justify-between"
                >
                  <div className="flex items-center">
                    <img src="../../assets/images/polygon.png" alt="op" />
                    <span className="text-lg ml-3"> Polygon</span>
                  </div>                
                    <div className="w-3 h-3 bg-[#07D942] rounded-full"></div>
                </div>
                :
                <div className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg"
                  onClick={() => onClickChangeNetwork(POLYGON_CHAIN_ID) }>
                  <img
                    className="w-8 h-8 mr-3"
                    src="../../assets/images/polygon.png"
                    alt="polygon"
                  />
                  <h2 className="font-medium text-sm">Polygon</h2>
                </div>
              }
              {
                chainId && (chainId.toString() === GNOSIS_CHAIN_ID || chainId.toString() === GNOSIS_NETWORK_ID) ?
                <div className="flex my-5 items-center justify-between"
                >
                  <div className="flex items-center">
                    <img src="../../assets/images/gnosis.png" alt="op" />
                    <span className="text-lg ml-3"> Gnosis</span>
                  </div>                
                    <div className="w-3 h-3 bg-[#07D942] rounded-full"></div>
                </div>
                :
                <div className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg"
                  onClick={() => onClickChangeNetwork(GNOSIS_CHAIN_ID) }
                >
                  <img
                    className="w-8 h-8 mr-3"
                    src="../../assets/images/gnosis.png"
                    alt="gnosis"
                  />
                  <h2 className="font-medium text-sm">Gnosis</h2>
                </div>
              }
              {
                chainId && (chainId.toString() === BSC_CHAIN_ID || chainId.toString() === BSC_NETWORK_ID) ?
                <div className="flex my-5 items-center justify-between"
                >
                  <div className="flex items-center">
                    <img src="../../assets/images/binance.png" alt="op" />
                    <span className="text-lg ml-3"> Binance</span>
                  </div>                
                    <div className="w-3 h-3 bg-[#07D942] rounded-full"></div>
                </div>
                :
                <div className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg"
                  onClick={() => onClickChangeNetwork(BSC_CHAIN_ID)}
                >
                  <img
                    className="w-8 h-8 mr-3"
                    src="../../assets/images/binance.png"
                    alt="binance"
                  />
                  <h2 className="font-medium text-sm">Binance</h2>
                </div>
              }
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                if(connected === true) setShowLogoutMenu(!showLogoutMenu);
                if(connected === false) onClickConnectWallet();
              }}
              className="bg-[#1C1924] rounded-full  w-full lg:w-auto justify-center flex items-center  px-3 py-2"
            >
              <span className="gradient-text font-bold text-base mx-1">
                { connected === false && "Connect Wallet" }
                { connected === true && compressedAccount }
              </span>
              <img src="../../assets/icons/avatar.svg" alt="avatar" />
            </button>
            {
              connected === true && 
            <div
              className={`${
                showLogoutMenu
                  ? "top-12 block mt-2"
                  : "-top-[500px] hidden lg:block"
              } lg:absolute top-12 left-0 text-[#fff] z-50 duration-300 dropsDownBg rounded-xl w-full px-3 py-4`}
            >
              <div className="flex items-center px-2 my-1 hover:bg-[#242A38] cursor-pointer p-2 rounded-lg">
                <img src="../../assets/icons/dashboard.svg" alt="dashboard" />
                <span className="text-sm ml-3" onClick={() => {                    
                    setShowLogoutMenu(!showLogoutMenu); 
                  }}> Dashboard</span>
              </div>

              <div className="flex items-center px-2 my-1 hover:bg-[#242A38] cursor-pointer p-2 rounded-lg">
                <img src="../../assets/icons/support.svg" alt="support" />
                <span className="text-sm ml-3"
                onClick={() => {                    
                    setShowLogoutMenu(!showLogoutMenu); 
                  }}> Support</span>
              </div>

              <div className="flex items-center px-2 my-1 hover:bg-[#242A38] cursor-pointer p-2 rounded-lg">
                <img src="../../assets/icons/logout.svg" alt="logout" />
                <span className="text-sm ml-3"
                  onClick={() => {                    
                    setShowLogoutMenu(!showLogoutMenu); onClickDisconnect();
                  }}
                > Logout</span>
              </div>
            </div>
            }
          </div>
          <div className="hidden lg:block">
            <DarkLightMode />
          </div>
        </div>
      </div>
    </div>

    // <div className='header w-full dark:bg-slate-900' style={{zIndex:"100"  }}	>
    // 	<section className="relative ">
    // 		<div className="container bg-tarnsparent">
    // 			<nav className="flex justify-between py-6">
    // 				<div className="flex justify-between items-center w-full">
    // 					<div className="w-2/12">
    // 						<div className="flex items-center whitespace-nowrap" onClick={() => { navigate("/") }}>
    // 							<img className="h-12 handCursor" src="/images/logo.png" alt="logo" />
    // 							<h4 className='handCursor ml-1 font-bold text-xl title text-gray-700 dark:text-gray-100 tracking-widest'>GiveStation</h4>
    // 						</div>
    // 					</div>
    // 					<div className="xl:5/12 lg:w-5/12 w-5/12">
    // 						<ul className="hidden xl:flex " style={{ justifyContent: "center" }}>
    // 							<li className="mr-3">
    // 								<NavLink className="handCursor text-gray-700  font-bold dark:text-gray-100"	to="/">
    // 									Grants
    // 								</NavLink>
    // 							</li>
    // 							<li className="mr-3"><div className={'handCursor text-gray-700  font-bold dark:text-gray-100'} onClick={() => { navigate("/create-campaign") }}>Create a grant</div></li>
    // 							<li className="mr-3">
    // 								<a className="handCursor text-gray-700  font-bold dark:text-gray-100" href="ipfs://bafybeigoqsn4s5hnr32olfj7tqrqwz2lejmby4y5to75gnzpvdlm23g76a/#/givestation.eth" target="_blank"	>
    // 									GiveStation DAO
    // 								</a>
    // 							</li>
    // 						</ul>
    // 					</div>
    // 					<div className="xl:w-5/12 lg:w-6/12 w-6/12">
    // 						<div className="hidden xl:flex items-center justify-end">
    // 							{
    // 								active === null ?
    // 									<button className="py-2 flex justify-center items-center px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 whitespace-nowrap" onClick={() => { setPopup(!popup) }}>
    // 										Select a network
    // 									</button>
    // 									:
    // 									<button className="py-2 flex justify-center items-center px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 whitespace-nowrap" onClick={() => { setPopup(!popup) }}>
    // 										<img src={'/images/' + activeIcon} alt="op" className='opimg mr-2' />
    // 										{active}
    // 									</button>
    // 							}
    // 							<div className="relative">
    // 							{
    // 								connected === false &&
    // 								<button className="ml-6 py-2 px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 whitespace-nowrap" onClick={() => { onClickConnectWallet() }}>
    // 									Connect Wallet
    // 								</button>
    // 							}
    // 							{
    // 								connected === true &&
    // 									<button className="ml-6 py-2 px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 whitespace-nowrap" onClick={() => { setShowLogoutMenu(!showLogoutMenu) }}>
    // 										{compressedAccount}
    // 									</button>
    // 							}
    // 							{
    // 								showLogoutMenu === true &&
    // 								<div className="absolute top-12 bottom-12 right-6 bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700" style={{ zIndex:"1500" }}>
    // 									<ul  className="py-1 "
    // 									>
    // 										<li className="handCursor" onClick={() => { setShowLogoutMenu(!showLogoutMenu); navigate(`/overview`); }}>
    // 											<span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-[#fff]">Dashboard</span>
    // 										</li>
    // 										<li className="handCursor" onClick={() => { setShowLogoutMenu(!showLogoutMenu); onClickDisconnect(); }}>
    // 											<span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-[#fff]">Log out</span>
    // 										</li>
    // 									</ul>
    // 								</div>
    // 							}
    // 							</div>
    // 							<DarkLightMode />
    // 						</div>

    // 					</div>
    // 				</div>
    // 				<button className="navbar-burger self-center xl:hidden" onClick={() => { setMenu(!menu) }}>
    // 					<svg width="35" height="35" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    // 						<rect className="text-gray-800" width="32" height="32" rx="6" fill="currentColor"></rect>
    // 						<path className="text-gray-800" d="M7 12H25C25.2652 12 25.5196 11.8946 25.7071 11.7071C25.8946 11.5196 26 11.2652 26 11C26 10.7348 25.8946 10.4804 25.7071 10.2929C25.5196 10.1054 25.2652 10 25 10H7C6.73478 10 6.48043 10.1054 6.29289 10.2929C6.10536 10.4804 6 10.7348 6 11C6 11.2652 6.10536 11.5196 6.29289 11.7071C6.48043 11.8946 6.73478 12 7 12ZM25 15H7C6.73478 15 6.48043 15.1054 6.29289 15.2929C6.10536 15.4804 6 15.7348 6 16C6 16.2652 6.10536 16.5196 6.29289 16.7071C6.48043 16.8946 6.73478 17 7 17H25C25.2652 17 25.5196 16.8946 25.7071 16.7071C25.8946 16.5196 26 16.2652 26 16C26 15.7348 25.8946 15.4804 25.7071 15.2929C25.5196 15.1054 25.2652 15 25 15ZM25 20H7C6.73478 20 6.48043 20.1054 6.29289 20.2929C6.10536 20.4804 6 20.7348 6 21C6 21.2652 6.10536 21.5196 6.29289 21.7071C6.48043 21.8946 6.73478 22 7 22H25C25.2652 22 25.5196 21.8946 25.7071 21.7071C25.8946 21.5196 26 21.2652 26 21C26 20.7348 25.8946 20.4804 25.7071 20.2929C25.5196 20.1054 25.2652 20 25 20Z" fill="#ffffff"></path>
    // 					</svg>
    // 				</button>
    // 			</nav>
    // 			{menu ? <>
    // 				<div className="navbar-menu fixed top-0 left-0 z-50 w-full h-full bg-opacity-50 shadow-lg" onClick={() => { setMenu(!menu) }}>
    // 					<div className="fixed top-0 left-0 bottom-0 w-full max-w-xs">
    // 						<nav className="relative h-full overflow-y-auto">
    // 							<div className="flex flex-col h-full bg-gray-800">
    // 								<div className="flex items-center justify-between py-6 px-6 bg-gray-900">
    // 									<NavLink className="flex items-center whitespace-nowrap" to="/">
    // 										<img className="h-12" src="/images/logo.png" alt="logo" />
    // 										<h4 className=' ml-1 font-medium text-xl title text-[#fff] tracking-widest'>GiveStation</h4>
    // 									</NavLink>
    // 									<button className="text-[#fff]" onClick={() => { setMenu(!menu) }}>
    // 										<svg width="12" height="12" viewBox="0 0 12 12" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
    // 											<path d="M6.94004 6L11.14 1.80667C11.2656 1.68113 11.3361 1.51087 11.3361 1.33333C11.3361 1.1558 11.2656 0.985537 11.14 0.860002C11.0145 0.734466 10.8442 0.66394 10.6667 0.66394C10.4892 0.66394 10.3189 0.734466 10.1934 0.860002L6.00004 5.06L1.80671 0.860002C1.68117 0.734466 1.51091 0.663941 1.33337 0.663941C1.15584 0.663941 0.985576 0.734466 0.860041 0.860002C0.734505 0.985537 0.66398 1.1558 0.66398 1.33333C0.66398 1.51087 0.734505 1.68113 0.860041 1.80667L5.06004 6L0.860041 10.1933C0.797555 10.2553 0.747959 10.329 0.714113 10.4103C0.680267 10.4915 0.662842 10.5787 0.662842 10.6667C0.662842 10.7547 0.680267 10.8418 0.714113 10.9231C0.747959 11.0043 0.797555 11.078 0.860041 11.14C0.922016 11.2025 0.99575 11.2521 1.07699 11.2859C1.15823 11.3198 1.24537 11.3372 1.33337 11.3372C1.42138 11.3372 1.50852 11.3198 1.58976 11.2859C1.671 11.2521 1.74473 11.2025 1.80671 11.14L6.00004 6.94L10.1934 11.14C10.2554 11.2025 10.3291 11.2521 10.4103 11.2859C10.4916 11.3198 10.5787 11.3372 10.6667 11.3372C10.7547 11.3372 10.8419 11.3198 10.9231 11.2859C11.0043 11.2521 11.0781 11.2025 11.14 11.14C11.2025 11.078 11.2521 11.0043 11.286 10.9231C11.3198 10.8418 11.3372 10.7547 11.3372 10.6667C11.3372 10.5787 11.3198 10.4915 11.286 10.4103C11.2521 10.329 11.2025 10.2553 11.14 10.1933L6.94004 6Z" fill="#556987"></path>
    // 										</svg>
    // 									</button>
    // 								</div>
    // 								<div className="bg-gray-800">
    // 									<ul className="md:flex-col md:min-w-full flex flex-col list-none pb-8" onClick={() => { setMenu(!menu) }}>
    // 										<li className="items-center hover:bg-primary">
    // 											<NavLink to="/"
    // 												className={(props) => { return props.isActive ? 'capitalize py-2.5 px-6 block text-slate-800 whitespace-nowrap text-md border-b border-gray-700 bg-primary' : 'capitalize py-2.5 px-6 block text-[#fff]  hover:text-slate-800 whitespace-nowrap text-md border-b border-gray-700' }}>
    // 												Grants
    // 											</NavLink>
    // 										</li>
    // 										<li className="items-center hover:bg-primary">
    // 											<NavLink to="/create-campaign" className={(props) => { return props.isActive ? 'capitalize py-2.5 px-6 block text-slate-800 whitespace-nowrap text-md border-b border-gray-700 bg-primary' : 'capitalize py-2.5 px-6 block text-[#fff]  hover:text-slate-800 whitespace-nowrap text-md border-b border-gray-700' }}>
    // 												<h5 className='text-[#fff]'>Create a grant</h5>
    // 											</NavLink>
    // 										</li>
    // 										<li className="items-center hover:bg-primary">
    // 											<NavLink to="ipfs://bafybeigoqsn4s5hnr32olfj7tqrqwz2lejmby4y5to75gnzpvdlm23g76a/#/givestation.eth"
    // 												className={(props) => { return props.isActive ? 'capitalize py-2.5 px-6 block text-slate-800 whitespace-nowrap text-md border-b border-gray-700 bg-primary' : 'capitalize py-2.5 px-6 block text-[#fff]  hover:text-slate-800 whitespace-nowrap text-md border-b border-gray-700' }}>
    // 												<h5 className='text-[#fff]'>GiveStation DAO</h5>
    // 											</NavLink>
    // 										</li>
    // 									</ul>
    // 									<div className="flex flex-wrap " style={{ marginBottom: "10px" }}>
    // 										<div className="w-full flex justify-center">
    // 											{
    // 												active === null ?
    // 													<button className="py-2 flex justify-center items-center px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 whitespace-nowrap"
    // 														onClick={() => { setPopup(!popup) }}
    // 														style={{ minWidth: "200px" }}
    // 													>
    // 														Select a network
    // 													</button>
    // 													:
    // 													<button className="py-2 flex justify-center items-center px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 whitespace-nowrap"
    // 														onClick={() => { setPopup(!popup) }}
    // 														style={{ minWidth: "200px" }}
    // 													>
    // 														<img src={'/images/' + activeIcon} alt="op" className='opimg mr-2' />
    // 														{active}
    // 													</button>
    // 											}
    // 										</div>
    // 									</div>
    // 									<div className="flex">
    // 										<div className="w-full flex justify-center">
    // 											<button onClick={() => { onClickConnectWallet() }} className="py-2 px-4 text-sm leading-5 text-[#fff] bg-gradient-secondary font-bold rounded-full"
    // 												style={{ minWidth: "200px" }}
    // 											>
    // 												{connected ? compressedAccount : 'Connect Wallet'}
    // 											</button>
    // 										</div>
    // 									</div>
    // 									{
    // 										connected === true &&
    // 										<div className="w-full flex justify-center" style={{ marginTop: "10px", userSelect:"none", cursor:"pointer" }}>
    // 											<ul  className="py-1 "
    // 											>
    // 												<li className="handCursor" onClick={() => { setShowLogoutMenu(!showLogoutMenu); navigate(`/overview`); }}>
    // 													<span className="block px-4 py-2 text-[#fff]">Dashboard</span>
    // 												</li>
    // 												<li className="handCursor" onClick={() => { setShowLogoutMenu(!showLogoutMenu); onClickDisconnect(); }}>
    // 													<span className="block px-4 py-2  text-[#fff]">Log out</span>
    // 												</li>
    // 											</ul>
    // 										</div>
    // 									}
    // 								</div>

    // 							</div>
    // 						</nav>

    // 					</div>
    // 				</div>
    // 			</> : ''}

    // 		</div>
    // 	</section>
    // 	{connectPopup ? <>
    // 		<section className="popup fixed w-full top-0 left-0 z-50 min-h-screen flex items-center justify-center">
    // 			<div className="connect-popup">
    // 				<div className="popup-head py-12 px-6 flex justify-between items-center">
    // 					<div className='w-full'>
    // 						<h4 className='text-[#fff] text-xl font-bold text-center'>Connect to Wallet</h4>
    // 					</div>
    // 					<div className="closebtn cursor-pointer" onClick={() => { setConnectPopup(!connectPopup) }}>
    // 						<img src="/images/close.png" alt="close" className='ml-auto' />
    // 					</div>
    // 				</div>
    // 				<div className="px-6">
    // 					<div className='popup-body px-5 py-5 rounded-xl'>
    // 						<div className='flex justify-between items-start'>
    // 							<h5 className='text-[#fff] pop-title font-bold text-lg cursor-pointer' onClick={() => { setConnected(true); setConnectPopup(!connectPopup) }}>Metamask</h5>
    // 							<img src="/images/metamask.png" alt="close" className='ml-auto' />
    // 						</div>
    // 					</div>
    // 					<div className="popup-content pt-2 px-5">
    // 						<div className='flex justify-between items-start py-2 md:py-4'>
    // 							<h5 className='text-[#fff] pop-title font-bold text-lg cursor-pointer' onClick={() => { setConnected(true); setConnectPopup(!connectPopup) }}>WalletConnect</h5>
    // 							<img src="/images/wallet-connect.png" alt="close" className='ml-auto' />
    // 						</div>
    // 						<div className='flex justify-between items-start py-2 md:py-4'>
    // 							<h5 className='text-[#fff] pop-title font-bold text-lg cursor-pointer' onClick={() => { setConnected(true); setConnectPopup(!connectPopup) }}>GiveWallet<span className='text-xs'>(Coming Soon)</span> </h5>
    // 							<img src="/images/give-icon.png" alt="close" className='ml-auto' />
    // 						</div>
    // 						<div className='flex justify-between items-start py-2 md:py-4'>
    // 							<h5 className='text-[#fff] pop-title font-bold text-lg cursor-pointer' onClick={() => { setConnected(true); setConnectPopup(!connectPopup) }}>Portis</h5>
    // 							<img src="/images/portis.png" alt="close" className='ml-auto' />
    // 						</div>
    // 						<div className="connectbtn mt-6 text-center">
    // 							<button className='block bg-light-blue text-[#fff] px-10 py-2 rounded-xl w-9/12 mx-auto text-lg'>Connect</button>
    // 							<p className='my-3 text-xs text-[#fff]'>New to Ethereum? <a href="/" className='text-blue-500 ml-1.5 underline underline-offset-2'>Learn more about wallets</a></p>
    // 						</div>
    // 					</div>
    // 				</div>
    // 			</div>
    // 		</section>
    // 	</> : ''}

    // 	{/* connect wallert popup */}
    // 	{popup ? <>
    // 		<section className="popup fixed w-full top-0 left-0 z-50 min-h-screen flex items-center justify-center">
    // 			<div className="main-popup">
    // 				<div className="popup-head py-6 md:py-12 px-6 flex justify-between items-center">
    // 					<h4 className='text-[#fff] text-xl font-bold'>Select a network</h4>
    // 					<div className="closebtn cursor-pointer" onClick={() => { setPopup(!popup) }}>
    // 						<img src="/images/close.png" alt="close" className='ml-auto' />
    // 					</div>
    // 				</div>
    // 				<div className="px-6">
    // 					{chainId && (chainId.toString() === OPTIMISTIC_CHAIN_ID || chainId.toString() === OPTIMISTIC_NETWORK_ID) ?
    // 						<div className='popup-body px-5 py-5 rounded-xl'>
    // 							<div className='flex justify-between items-start'>
    // 								<h5 className='text-[#fff] pop-title font-bold text-lg'>{active}</h5>
    // 								<div className="circle w-4 h-4 bg-lime-500 rounded-full ml-auto"></div>
    // 							</div>
    // 							<div className='flex justify-between items-start mt-2'>
    // 								<img src={'/images/' + activeIcon} alt={active} />
    // 								{/* <p className='text-[#fff]' style={{ cursor: "pointer", userSelect: "none" }} onClick={() => { onClickDisconnect() }}>Disconnect</p> */}
    // 							</div>
    // 						</div>
    // 						:
    // 						<div className="popup-content pt-2 px-5">
    // 							<div className='flex justify-between items-start py-2 md:py-4'>
    // 								<h5 className='text-[#fff] pop-title font-bold text-lg cursor-pointer' onClick={() => { onClickChangeNetwork(OPTIMISTIC_CHAIN_ID); }}>Optimism</h5>
    // 								<img src="/images/op.png" alt="close" className='ml-auto' />
    // 							</div>
    // 						</div>
    // 					}
    // 					{chainId && (chainId.toString() === ARBITRUM_CHAIN_ID || chainId.toString() === ARBITRUM_NETWORK_ID) ?
    // 						<div className='popup-body px-5 py-5 rounded-xl'>
    // 							<div className='flex justify-between items-start'>
    // 								<h5 className='text-[#fff] pop-title font-bold text-lg'>{active}</h5>
    // 								<div className="circle w-4 h-4 bg-lime-500 rounded-full ml-auto"></div>
    // 							</div>
    // 							<div className='flex justify-between items-start mt-2'>
    // 								<img src={'/images/' + activeIcon} alt={active} />
    // 								{/* <p className='text-[#fff]' style={{ cursor: "pointer", userSelect: "none" }} onClick={() => { onClickDisconnect() }}>Disconnect</p> */}
    // 							</div>
    // 						</div>
    // 						:
    // 						<div className="popup-content pt-2 px-5">
    // 							<div className='flex justify-between items-start py-2 md:py-4'>
    // 								<h5 className='text-[#fff] pop-title font-bold text-lg cursor-pointer' onClick={() => { onClickChangeNetwork(ARBITRUM_CHAIN_ID); }}>Arbitrum</h5>
    // 								<img src="/images/symbol.png" alt="close" className='ml-auto' />
    // 							</div>
    // 						</div>
    // 					}
    // 					{chainId && (chainId.toString() === POLYGON_CHAIN_ID || chainId.toString() === POLYGON_NETWORK_ID) ?
    // 						<div className='popup-body px-5 py-5 rounded-xl'>
    // 							<div className='flex justify-between items-start'>
    // 								<h5 className='text-[#fff] pop-title font-bold text-lg'>{active}</h5>
    // 								<div className="circle w-4 h-4 bg-lime-500 rounded-full ml-auto"></div>
    // 							</div>
    // 							<div className='flex justify-between items-start mt-2'>
    // 								<img src={'/images/' + activeIcon} alt={active} />
    // 								{/* <p className='text-[#fff]' style={{ cursor: "pointer", userSelect: "none" }} onClick={() => { onClickDisconnect() }}>Disconnect</p> */}
    // 							</div>
    // 						</div>
    // 						:
    // 						<div className="popup-content pt-2 px-5">
    // 							<div className='flex justify-between items-start py-2 md:py-4'>
    // 								<h5 className='text-[#fff] pop-title font-bold text-lg cursor-pointer' onClick={() => { onClickChangeNetwork(POLYGON_CHAIN_ID); }}>Polygon</h5>
    // 								<img src="/images/group.png" alt="close" className='ml-auto' />
    // 							</div>
    // 						</div>
    // 					}
    // 					{chainId && (chainId.toString() === GNOSIS_CHAIN_ID || chainId.toString() === GNOSIS_NETWORK_ID) ?
    // 						<div className='popup-body px-5 py-5 rounded-xl'>
    // 							<div className='flex justify-between items-start'>
    // 								<h5 className='text-[#fff] pop-title font-bold text-lg'>{active}</h5>
    // 								<div className="circle w-4 h-4 bg-lime-500 rounded-full ml-auto"></div>
    // 							</div>
    // 							<div className='flex justify-between items-start mt-2'>
    // 								<img src={'/images/' + activeIcon} alt={active} />
    // 								{/* <p className='text-[#fff]' style={{ cursor: "pointer", userSelect: "none" }} onClick={() => { onClickDisconnect() }}>Disconnect</p> */}
    // 							</div>
    // 						</div>
    // 						:
    // 						<div className="popup-content pt-2 px-5">
    // 							<div className='flex justify-between items-start py-2 md:py-4'>
    // 								<h5 className='text-[#fff] pop-title font-bold text-lg cursor-pointer' onClick={() => { onClickChangeNetwork(GNOSIS_CHAIN_ID); }}>Gnosis</h5>
    // 								<img src="/images/gnosis.png" alt="close" className='ml-auto' />
    // 							</div>
    // 						</div>
    // 					}
    // 					{chainId && (chainId.toString() === BSC_CHAIN_ID || chainId.toString() === BSC_NETWORK_ID) ?
    // 						<div className='popup-body px-5 py-5 rounded-xl'>
    // 							<div className='flex justify-between items-start'>
    // 								<h5 className='text-[#fff] pop-title font-bold text-lg'>{active}</h5>
    // 								<div className="circle w-4 h-4 bg-lime-500 rounded-full ml-auto"></div>
    // 							</div>
    // 							<div className='flex justify-between items-start mt-2'>
    // 								<img src={'/images/' + activeIcon} alt={active} />
    // 								{/* <p className='text-[#fff]' style={{ cursor: "pointer", userSelect: "none" }} onClick={() => { onClickDisconnect() }}>Disconnect</p> */}
    // 							</div>
    // 						</div>
    // 						:
    // 						<div className="popup-content pt-2 px-5">
    // 							<div className='flex justify-between items-start py-2 md:py-4'>
    // 								<h5 className='text-[#fff] pop-title font-bold text-lg cursor-pointer' onClick={() => { onClickChangeNetwork(BSC_CHAIN_ID); }}>Binance</h5>
    // 								<img src="/images/protocol.png" alt="close" className='ml-auto' />
    // 							</div>
    // 						</div>
    // 					}
    // 					{
    // 						// chainId && (chainId.toString() === BSC_TEST_CHAIN_ID || chainId.toString() === BSC_TEST_NETWORK_ID) ?
    // 						// <div className='popup-body px-5 py-5 rounded-xl'>
    // 						// 	<div className='flex justify-between items-start'>
    // 						// 		<h5 className='text-[#fff] pop-title font-bold text-lg'>{active}</h5>
    // 						// 		<div className="circle w-4 h-4 bg-lime-500 rounded-full ml-auto"></div>
    // 						// 	</div>
    // 						// 	<div className='flex justify-between items-start mt-2'>
    // 						// 		<img src={'/images/' + activeIcon} alt={active} />
    // 						// 		{/* <p className='text-[#fff]' style={{ cursor: "pointer", userSelect: "none" }} onClick={() => { onClickDisconnect() }}>Disconnect</p> */}
    // 						// 	</div>
    // 						// </div>
    // 						// :
    // 						// <div className="popup-content pt-2 px-5">
    // 						// 	<div className='flex justify-between items-start py-2 md:py-4'>
    // 						// 		<h5 className='text-[#fff] pop-title font-bold text-lg cursor-pointer' onClick={() => { onClickChangeNetwork(BSC_TEST_CHAIN_ID); }}>BSC Testnet</h5>
    // 						// 		<img src="/images/protocol.png" alt="close" className='ml-auto' />
    // 						// 	</div>
    // 						// </div>
    // 					}
    // 				</div>
    // 			</div>
    // 		</section>
    // 	</> : ''}

    // 	{showAlert === true &&
    // 		<Alert type={alertType} title={alertTitle} content={alertContent} onClose={onCloseAlert} />
    // 	}
    // </div>
  );
}
