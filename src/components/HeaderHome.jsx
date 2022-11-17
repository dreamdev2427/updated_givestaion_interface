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
  GOERLI_NETWORK_ID,
  GOERLI_CHAIN_ID,
  TEST_ARBITRUM_CHAIN_ID,
  TEST_ARBITRUM_NETWORK_ID,
  MUMBAI_CHAIN_ID,
  MUMBAI_NETWORK_ID,
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

export default function Header({ isSideBarOpen = false, setIsSideBarOpen }) {
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
      case GOERLI_CHAIN_ID:
      case GOERLI_NETWORK_ID:
        setActive("Optimism Goerli ");
        setActiveIcon("op.png");
        setPopup(false);
        break;
      case OPTIMISTIC_CHAIN_ID:
      case OPTIMISTIC_NETWORK_ID:
        setActive("Optimism");
        setActiveIcon("op.png");
        setPopup(false);
        break;
      case BSC_TEST_CHAIN_ID:
      case BSC_TEST_NETWORK_ID:
        setActive("Binance testnet");
        setActiveIcon("binance.png");
        setPopup(false);
        break;
      case TEST_ARBITRUM_CHAIN_ID:
      case TEST_ARBITRUM_NETWORK_ID:
        setActive("Arbitrum testnet");
        setActiveIcon("arbitrum.png");
        setPopup(false);
      case ARBITRUM_CHAIN_ID:
      case ARBITRUM_NETWORK_ID:
        setActive("Arbitrum");
        setActiveIcon("arbitrum.png");
        setPopup(false);
        break;
      case MUMBAI_CHAIN_ID:
      case MUMBAI_NETWORK_ID:
        setActive("Polygon testnet");
        setActiveIcon("polygon.png");
        setPopup(false);
        break;
      case POLYGON_CHAIN_ID:
      case POLYGON_NETWORK_ID:
        setActive("Polygon");
        setActiveIcon("polygon.png");
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
        setActiveIcon("binance.png");
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
      <div className="sticky top-0 left-0 right-0 z-40 flex items-center justify-between w-full p-3 lg:hidden">
        <Link to={"/"} className="flex items-center lg:hidden">
          <img
            className="object-contain w-20 h-20"
            src={`${window.location.origin}/images/logo.png`}
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
              className="w-5 h-5 cursor-pointer "
              src={`${window.location.origin}/assets/icons/opener.svg`}
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
        <div className="flex items-center justify-between px-8 md:hidden">
          <div className="flex items-center">
            <img
              className="object-contain w-16 h-16"
              src={`${window.location.origin}/images/logo.png`}
              alt="logo"
            />
            <h2 className="font-medium text-2xl text-[#fff]">GiveStation</h2>
          </div>
          <img
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="ml-5 cursor-pointer lg:hidden"
            src={`${window.location.origin}/assets/icons/close.svg`}
            alt="close"
          />
        </div>
        <div className="flex flex-col items-center md:space-y-3 lg:space-y-0 lg:space-x-3 lg:flex-row">
          {isSideBarOpen === false && (
            <Link to={"/"} className="items-center hidden lg:flex">
              <img
                className="object-contain w-20 h-20"
                src={`${window.location.origin}/images/logo.png`}
                alt="logo"
              />
              <h2 className="font-medium text-2xl text-[#09080C] dark:text-[#fff]">
                GiveStation
              </h2>
            </Link>
          )}
          <Link to={"/"}>
            <button className="text-left md:text-center hover:bg-[#00FBFF] hover:md:bg-[#09080C] md:bg-[#09080C] w-full lg:w-auto md:my-2 md:rounded-md py-2 px-4 shadow">
              <span className="text-base gradient-text">Grants</span>
            </button>
          </Link>

          <Link
            to={"/hackathon"}
            className="relative bg-[#09080C] w-full lg:w-auto my-2 rounded-md py-2 px-4 shadow"
          >
            <span className="text-base gradient-text">Hackathons</span>

            <div className="coming-soon absolute -bottom-[14px] right-0 text-[#fff] px-3 py-1 rounded-xl text-xs">
              Coming Soon
            </div>
          </Link>
          <div className="text-left md:text-center  hover:md:bg-[#09080C] md:bg-[#09080C] w-full lg:w-auto md:my-2 md:rounded-md py-2 px-4 shadow">
            <span className="text-base gradient-text">Claim GVST</span>
          </div>
        </div>
        <div className="flex flex-col px-8 mt-5 space-y-3 md:px-0 md:mt-0 lg:space-y-0 lg:space-x-3 lg:flex-row lg:items-center">
          <div className="relative">
            <button
              onClick={() => {
                setIsOptimisimOpen(!isOptimisimOpen);
              }}
              className={`bg-[#1C1924] rounded-full w-full lg:w-auto flex justify-center md:justify-start items-center duration-300  ${
                isOptimisimOpen ? " px-10 " : " px-3 "
              } py-2`}
            >
              {active ? (
                <img
                  src={`${window.location.origin}/assets/images/${activeIcon}`}
                  alt="op"
                />
              ) : (
                <></>
              )}
              <span className="ml-5 text-base gradient-text">
                {active || "Select a network"}
              </span>
            </button>

            <div
              className={`${
                isOptimisimOpen
                  ? "top-12 block mt-2"
                  : "-top-[500px] hidden lg:block"
              } lg:absolute top-12 left-0 text-[#fff] z-50 duration-300 dropsDownBg rounded-xl w-full px-3 py-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-semibold">Select a network</h1>
                <img
                  onClick={() => {
                    setIsOptimisimOpen(!isOptimisimOpen);
                  }}
                  className="cursor-pointer"
                  src={`${window.location.origin}/assets/icons/close.svg`}
                  alt="close"
                />
              </div>
              {chainId &&
              (chainId.toString() === GOERLI_NETWORK_ID ||
                chainId.toString() === GOERLI_CHAIN_ID) ? (
                <div className="flex items-center justify-between my-5">
                  <div className="flex items-center">
                    <img
                      src={`${window.location.origin}/assets/images/op.png`}
                      alt="op"
                    />
                    <span className="ml-3 text-lg">Optimism Goerli </span>
                  </div>
                  <div className="w-3 h-3 bg-[#07D942] rounded-full"></div>
                </div>
              ) : (
                <div
                  className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg"
                  onClick={() => onClickChangeNetwork(GOERLI_CHAIN_ID)}
                >
                  <img
                    className="w-8 h-8 mr-3"
                    src={`${window.location.origin}/assets/images/op.png`}
                    alt="optimism"
                  />{" "}
                  <h2 className="text-sm font-medium">Optimism Goerli </h2>
                </div>
              )}
              {chainId &&
              (chainId.toString() === TEST_ARBITRUM_CHAIN_ID ||
                chainId.toString() === TEST_ARBITRUM_NETWORK_ID) ? (
                <div className="flex items-center justify-between my-5">
                  <div className="flex items-center">
                    <img
                      src={`${window.location.origin}/assets/images/arbitrum.png`}
                      alt="op"
                    />
                    <span className="ml-3 text-lg"> Arbitrum testnet</span>
                  </div>
                  <div className="w-3 h-3 bg-[#07D942] rounded-full"></div>
                </div>
              ) : (
                <div
                  className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg"
                  onClick={() => onClickChangeNetwork(TEST_ARBITRUM_CHAIN_ID)}
                >
                  <img
                    className="w-8 h-8 mr-3"
                    src={`${window.location.origin}/assets/images/arbitrum.png`}
                    alt="arbitrum"
                  />{" "}
                  <h2 className="text-sm font-medium">Arbitrum testnet</h2>
                </div>
              )}
              {chainId &&
              (chainId.toString() === MUMBAI_CHAIN_ID ||
                chainId.toString() === MUMBAI_NETWORK_ID) ? (
                <div className="flex items-center justify-between my-5">
                  <div className="flex items-center">
                    <img
                      src={`${window.location.origin}/assets/images/polygon.png`}
                      alt="op"
                    />
                    <span className="ml-3 text-lg">Polygon testnet</span>
                  </div>
                  <div className="w-3 h-3 bg-[#07D942] rounded-full"></div>
                </div>
              ) : (
                <div
                  className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg"
                  onClick={() => onClickChangeNetwork(MUMBAI_CHAIN_ID)}
                >
                  <img
                    className="w-8 h-8 mr-3"
                    src={`${window.location.origin}/assets/images/polygon.png`}
                    alt="polygon"
                  />
                  <h2 className="text-sm font-medium">Polygon testnet</h2>
                </div>
              )}
              {chainId &&
              (chainId.toString() === GNOSIS_CHAIN_ID ||
                chainId.toString() === GNOSIS_NETWORK_ID) ? (
                <div className="flex items-center justify-between my-5">
                  <div className="flex items-center">
                    <img
                      src={`${window.location.origin}/assets/images/gnosis.png`}
                      alt="op"
                    />
                    <span className="ml-3 text-lg"> Gnosis</span>
                  </div>
                  <div className="w-3 h-3 bg-[#07D942] rounded-full"></div>
                </div>
              ) : (
                <div
                  className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg"
                  onClick={() => onClickChangeNetwork(GNOSIS_CHAIN_ID)}
                >
                  <img
                    className="w-8 h-8 mr-3"
                    src={`${window.location.origin}/assets/images/gnosis.png`}
                    alt="gnosis"
                  />
                  <h2 className="text-sm font-medium">Gnosis</h2>
                </div>
              )}
              {chainId &&
              (chainId.toString() === BSC_TEST_CHAIN_ID ||
                chainId.toString() === BSC_TEST_NETWORK_ID) ? (
                <div className="flex items-center justify-between my-5">
                  <div className="flex items-center">
                    <img
                      src={`${window.location.origin}/assets/images/binance.png`}
                      alt="op"
                    />
                    <span className="ml-3 text-lg"> Binance testnet</span>
                  </div>
                  <div className="w-3 h-3 bg-[#07D942] rounded-full"></div>
                </div>
              ) : (
                <div
                  className="flex my-1 items-center hover:bg-[#242A38] cursor-pointer  px-0 py-2 rounded-lg"
                  onClick={() => onClickChangeNetwork(BSC_TEST_CHAIN_ID)}
                >
                  <img
                    className="w-8 h-8 mr-3"
                    src={`${window.location.origin}/assets/images/binance.png`}
                    alt="binance"
                  />
                  <h2 className="text-sm font-medium">Binance testnet</h2>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                if (connected === true) setShowLogoutMenu(!showLogoutMenu);
                if (connected === false) onClickConnectWallet();
              }}
              className="bg-[#1C1924] rounded-full  w-full lg:w-auto justify-center flex items-center  px-3 py-2"
            >
              <span className="mx-1 text-base font-bold gradient-text">
                {connected === false && "Connect Wallet"}
                {connected === true && compressedAccount}
              </span>
              <img
                src={`${window.location.origin}/assets/icons/avatar.svg`}
                alt="avatar"
              />
            </button>
            <div
              className={`${
                showLogoutMenu
                  ? "top-12 block mt-2"
                  : "-top-[500px] hidden lg:block"
              } lg:absolute top-12 left-0 text-[#fff] z-50 duration-300 dropsDownBg rounded-xl w-full px-3 py-4`}
            >
              <div className="flex items-center px-2 my-1 hover:bg-[#242A38] cursor-pointer p-2 rounded-lg">
                <img
                  src={`${window.location.origin}/assets/icons/dashboard.svg`}
                  alt="dashboard"
                />
                <span
                  className="ml-3 text-sm"
                  onClick={() => {
                    setShowLogoutMenu(!showLogoutMenu);
                    navigate("/overview");
                  }}
                >
                  {" "}
                  Dashboard
                </span>
              </div>

              <div className="flex items-center px-2 my-1 hover:bg-[#242A38] cursor-pointer p-2 rounded-lg">
                <img
                  src={`${window.location.origin}/assets/icons/support.svg`}
                  alt="support"
                />
                <span
                  className="ml-3 text-sm"
                  onClick={() => {
                    setShowLogoutMenu(!showLogoutMenu);
                  }}
                >
                  {" "}
                  Support
                </span>
              </div>

              <div className="flex items-center px-2 my-1 hover:bg-[#242A38] cursor-pointer p-2 rounded-lg">
                <img
                  src={`${window.location.origin}/assets/icons/logout.svg`}
                  alt="logout"
                />
                <span
                  className="ml-3 text-sm"
                  onClick={() => {
                    setShowLogoutMenu(!showLogoutMenu);
                    onClickDisconnect();
                  }}
                >
                  {" "}
                  Logout
                </span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <DarkLightMode />
          </div>
        </div>
      </div>
    </div>

    // 	{showAlert === true &&
    // 		<Alert type={alertType} title={alertTitle} content={alertContent} onClose={onCloseAlert} />
    // 	}
    // </div>
  );
}
