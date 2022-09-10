import React from "react";
import LikeCampImg from "./assets/likeCampImg.svg";
import HeartIcon from "./assets/heart.svg";
import HeartBlankIcon from "./assets/heart-blank.svg";
import Kemono from "./assets/Kemono.svg";
import { useNavigate } from "react-router";
import { NotificationManager } from "react-notifications";
import UserFooter from "../../components/user/UserFooter";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { backendURL } from "../../config";
import Sidebar1 from "../../components/user/Sidebar1";
import Header from "../../components/HeaderHome";
import Card from "../../components/user/Card";
import PageHeader from "../../components/user/PageHeader";

const LikedCampaigns = () => {
  const chainId = useSelector((state) => state.auth.currentChainId);
  const account = useSelector((state) => state.auth.currentWallet);
  const globalWeb3 = useSelector((state) => state.auth.globalWeb3);
  const [likesInfo, setLikesInfo] = useState([]);
  const navigate = useNavigate();
  const [ip, setIP] = useState("");

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const getLocationData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIP(res.data.IPv4);
  };

  useEffect(() => {
    getLocationData();
  }, []);

  const getLikesInfo = async () => {
    await axios({
      method: "post",
      url: `${backendURL}/api/likes/getAllLikedCampaigns`,
      data: {
        user: ip || "",
        chainId: chainId || "",
      },
    })
      .then((res) => {
        if (res.data && res.data.code === 0) {
          setLikesInfo(res.data.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getLikesInfo();
  }, [globalWeb3, account]);

  const onClickFavorites = async (idOnDB, val) => {
    await axios({
      method: "post",
      url: `${backendURL}/api/likes/set`,
      data: {
        campaign: idOnDB,
        user: ip || "",
        value: val,
      },
    })
      .then((res) => {
        if (res.data && res.data.code === 0) {
          getLikesInfo();
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
              <PageHeader heading={"Favourites"} />
              <div className="py-5 space-y-2">
              {
                likesInfo.length>0 && 
                likesInfo.map((item, index) => (
                <Card
                  key={index}
                  imgSrc={item?.campaign? `${backendURL}/${item.campaign?.imageURL}` : ""}
                  desc={ item.campaign?.description || "" }
                  title={item?.campaign? item.campaign?.name : ""}
                  heart="heart"
                />
                ))
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikedCampaigns;
