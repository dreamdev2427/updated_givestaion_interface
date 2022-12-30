import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { backendURL } from "../../config";
import UserFooter from "../../components/user/UserFooter";
import overviewImage from "./assets/overviewImage.svg";
import { chains } from "../../smart-contract/chains_constants";
import { NavLink } from "react-router-dom";
import Layout from "../../components/user/Layout";
import PageHeader from "../../components/user/PageHeader";
import Sidebar1 from "../../components/user/Sidebar1";
import Header from "../../components/HeaderHome";
const ERC20Abi = require("../../smart-contract/build/ERC20.json");

const Card = ({ title = "", imgSrc, counts=0 }) => {
  return (
    <div className="gradient-bg  dark:bg-gradient-to-b	from-[#3BA0E7] via-[#5CC6FF] to-[#A778E4] rounded-xl card-shadow p-4 text-White font-bold">
      <div className="flex justify-between text-lg	 ">
        <h1>{title}</h1>
        <img src={`./assets/icons/${imgSrc}.svg`} alt="donations" />
      </div>
      <h2 className="font-bold text-2xl	mb-4">{counts}</h2>
    </div>
  );
};

export default function Overview() {
  const chainId = useSelector((state) => state.auth.currentChainId);
  const account = useSelector((state) => state.auth.currentWallet);
  const globalWeb3 = useSelector((state) => state.auth.globalWeb3);
  const [statistics, setStatistics] = useState([0, 0, 0, 0]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  useEffect(() => {
    const getCountsInfo = async () => {
      if (account && globalWeb3) {
        let temAry = statistics;
        await axios({
          method: "post",
          url: `${backendURL}/api/donation/getDonationCountsOfUser`,
          data: {
            user: account || "",
            chainId: chainId || "",
          },
        })
          .then((res) => {
            if (res.data && res.data.code === 0) {
              temAry[0] = res.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
        await axios({
          method: "post",
          url: `${backendURL}/api/donation/getTotalDonatedAmountsOfUser`,
          data: {
            user: account || "",
            chainId: chainId || "",
          },
        })
          .then((res) => {
            if (res.data && res.data.code === 0) {
              temAry[1] = res.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
        await axios({
          method: "post",
          url: `${backendURL}/api/campaign/getCampaignCountsOfUser`,
          data: {
            user: account || "",
            chainId: chainId || "",
          },
        })
          .then((res) => {
            if (res.data && res.data.code === 0) {
              temAry[2] = res.data.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
        let givePoint = null;
        try {
          givePoint = new globalWeb3.eth.Contract(
            ERC20Abi,
            chains[chainId?.toString()]?.givePointAddress
          );
        } catch (err) {
          console.log(err);
        }
        if (givePoint !== null) {
          try {
            let gpBalance =
              (await givePoint.methods.balanceOf(account).call()) || 0;
            temAry[3] = globalWeb3.utils.fromWei(gpBalance.toString(), "ether");
            setStatistics(temAry);
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log("Invalid GivePoint");
        }
        setStatistics(temAry);
        setRefresh(!refresh);
      }
    };
    getCountsInfo();
  }, [account, globalWeb3]);

  return (
    <div className=" dark:bg-[#242A38] duration-300 ease-out	 bg-White min-h-screen">
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
              <PageHeader heading="Overview" />

              <div className="grid sm:grid-cols-2 lg:grid-cols-4  gap-4 md:gap-6 my-9">
                <Card title="DONATIONS" imgSrc="donations" counts={statistics[0]} />
                <Card title="AMOUNT DONATED" imgSrc="3-User" counts={statistics[1]} />
                <Card title="CAMPAIGNS" imgSrc="myprojects" counts={statistics[2]} />
                <Card title="GIVEPOINTS" imgSrc="donations" counts={statistics[3]} />
              </div>

              <div className="flex flex-col md:flex-row items-center ">
                <img src="./assets/images/robots.png" alt="robot" />

                <div
                  className={`font-bold text-[#0F172A] dark:text-[#52DCF0] flex flex-col items-center my-5 md:mt-0 md:ml-24`}
                >
                  <h1 className="text-2xl text-center md:text-left">
                    Welcome to GiveStation{" "}
                  </h1>
                  <h1 className="gradient-text-lg dark:bg-gradient-to-r	from-[#85FFC4] via-[#5CC6FF] to-[#BC85FF] my-8 text-xl max-w-[366px] text-center">
                    A layer 2 grant protocol that rewards you for funding ideas.
                  </h1>

                  <NavLink to="/" >
                  <button className="bg-[#000101] button-shadow rounded-2xl py-4 px-10">
                    <span className="gradient-text">Explore Grants</span>
                  </button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
