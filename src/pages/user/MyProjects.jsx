import React from "react";
import SampleProject from "./assets/sampleProject.svg";
import HeartIcon from "./assets/heart.svg";
import { useNavigate, useParams } from "react-router";
import UserFooter from "../../components/user/UserFooter";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import { backendURL } from "../../config";
import { chains } from "../../smart-contract/chains_constants";
import PageHeader from "../../components/user/PageHeader";
import Sidebar1 from "../../components/user/Sidebar1";
import Header from "../../components/HeaderHome";
import Icon from "../../components/Icon";

const MyProjects = () => {
  const chainId = useSelector((state) => state.auth.currentChainId);
  const account = useSelector((state) => state.auth.currentWallet);
  const globalWeb3 = useSelector((state) => state.auth.globalWeb3);
  const [campaigns, setCampaigns] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [category, setCategory] = useState("Defi");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingGrantId, setEditingGrantId] = useState(undefined);

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

  const onClickUpdateCampaign = async (e) => {
    e.preventDefault();
    let imagePath = null;
    const formData = new FormData();
    formData.append("itemFile", selectedFile);
    formData.append("authorId", "hch");
    // return;
    await axios({
      method: "post",
      url: `${backendURL}/api/utils/upload_file`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        imagePath = response.data.path;
      })
      .catch((err) => {
        console.error(err);
        setIsUpdateClick(!isUpdateClick);
        return;
      });

    await axios({
      method: "post",
      url: `${backendURL}/api/campaign/update`,
      data: {
        _id: editingGrantId,
        description: description,
        imageURL: imagePath !== null ? imagePath : imageURL,
        category: category,
        name: newName,
      },
    })
      .then((res) => {
        if (res.data && res.data.code === 0) {
          NotificationManager.success("Camapaign is updated!");
          navigate("/myprojects");
        }
      })
      .catch((err) => {
        console.error(err);
        setIsUpdateClick(!isUpdateClick);
      });
    setIsUpdateClick(!isUpdateClick);

    console.log("dddddddddd");
  };

  const changeFile = (event) => {
    var file = event.target.files[0];
    if (file == null) return;
    console.log(file);
    setSelectedFile(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {};
    reader.onerror = function (error) {};
  };

  useEffect(() => {
    initProjectsInfo();
    setRefresh(!refresh);
  }, [account, globalWeb3, chainId, setRefresh]);

  const onClickUpdate = (campaignIdOnDB) => {
    setEditingGrantId(campaignIdOnDB);
  };

  const subStr = (string) => {
    return string.length > 116 ? `${string.substring(0, 116)}...` : string;
  };

  return (
    <div className=" dark:bg-[#242A38] duration-300 ease-out	 bg-[#fff] min-h-screen">
      <div className="font-Jura ">
        <Sidebar1
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
        <div className=" lg:ml-72 lg:main">
          <Header
            setIsSideBarOpen={setIsSideBarOpen}
            isSideBarOpen={isSideBarOpen}
          />
          <div className="px-5 mt-8 lg:px-8">
            <div>
              <PageHeader heading={"My Projects"} />

              <div className="pb-5 mt-10 space-y-5">
                {!isUpdateClick ? (
                  <>
                    {campaigns.length > 0 &&
                      campaigns.map((item, index) => (
                        <div
                          className="rounded-lg bg-[#131420] p-2 flex flex-col md:flex-row space-x-3"
                          key={index}
                        >
                          <img
                            className="rounded-lg"
                            src={
                              `${backendURL}/${item?.imageURL}` ||
                              "./assets/images/casino.png"
                            }
                            style={{
                              width: "348px",
                              height: "200px",
                              alignSelf: "center",
                            }}
                            alt="casino"
                          />
                          <div className="text-[#fff] flex-1">
                            <div className="flex flex-col items-center justify-center mt-2 sm:flex-row md:mt-0 md:justify-start">
                              <h3 className="mr-4 text-lg font-bold">
                                {item?.name || ""}
                              </h3>
                              <div>
                                <button className="font-bold mx-1 text-xs py-1 px-5 bg-[#00C938] rounded-xl">
                                  Active
                                </button>
                                <button className="font-bold mx-1 text-xs py-1 px-5 bg-[#00C938] rounded-xl">
                                  {item?.verified === true
                                    ? "Verified"
                                    : "Unverified"}
                                </button>
                              </div>
                            </div>

                            <div
                              className="flex flex-col items-center justify-between w-full md:flex-row md:items-end"
                              style={{ alignItems: "center" }}
                            >
                              <div
                                className="flex flex-col items-center justify-center mt-4 space-x-5 md:flex-row md:items-end"
                                style={{ alignItems: "center" }}
                              >
                                <p className="text-center md:text-left md:max-w-[192px]">
                                  {subStr(item?.description) || ""}
                                </p>
                                <div className="bg-[#1B1C2D] hidden flex flex-col justify-center md:block w-[2px] h-10 rounded-lg"></div>
                                <div className="flex flex-col justify-center">
                                  <div className="flex items-center justify-between">
                                    <p className="my-1 mr-5 text-xs font-normal">
                                      Minimum Contribution
                                    </p>{" "}
                                    <h3 className="font-semibold text-[#fff] text-xs">
                                      {item?.minimum || 0.01}
                                      {
                                        chains[chainId?.toString()]
                                          ?.nativeCurrency
                                      }
                                    </h3>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <p className="my-1 mr-5 text-xs font-normal">
                                      Target
                                    </p>{" "}
                                    <h3 className="font-semibold text-[#fff] text-xs">
                                      {item?.target || 0.01}
                                      {
                                        chains[chainId?.toString()]
                                          ?.nativeCurrency
                                      }
                                    </h3>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <p className="my-1 mr-5 text-xs font-normal">
                                      Raised
                                    </p>{" "}
                                    <h3 className="font-semibold text-[#fff] text-xs">
                                      {item?.raised || 0.01}
                                      {
                                        chains[chainId?.toString()]
                                          ?.nativeCurrency
                                      }
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
                                      {item?.likes || 0}
                                    </h1>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setIsUpdateClick(!isUpdateClick);
                                      setCategory(item?.category);
                                      setDescription(item?.description);
                                      setImageURL(item?.imageURL);
                                      setNewName(item?.name);
                                      onClickUpdate(item?._id);
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
                      ))}
                  </>
                ) : (
                  <form className="flex flex-col mb-5 md:px-5">
                    <label className="dark:text-[#FFFFFF] text-[#000] opacity-70 text-center text-lg">
                      Update a grant
                    </label>
                    <label className="dark:text-[#FFFFFF] text-[#000] opacity-70 text-left">
                      Project name
                    </label>
                    <input
                      className="innerShadow bg-[#242A38] dark:bg-[#fff] rounded-2xl my-2 p-4 outline-none"
                      onChange={(e) => {
                        setNewName(e.target.value);
                      }}
                      value={newName || ""}
                    />
                    <label className="dark:text-[#FFFFFF] text-[#000] opacity-70 text-left">
                      Description
                    </label>
                    <textarea
                      className="innerShadow  bg-[#242A38] dark:bg-[#fff] h-20 rounded-2xl my-2	p-4 outline-none"
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      value={description || ""}
                    />

                    <label className="dark:text-[#FFFFFF] text-[#000] opacity-70 mt-2 mb-1">
                      Category
                    </label>
                    <input
                      className="innerShadow bg-[#242A38] dark:bg-[#fff] rounded-2xl my-2 p-4 outline-none"
                      onChange={(e) => {
                        setCategory(e.target.value);
                      }}
                      value={category || ""}
                    />

                    <div className="my-3 mb-6 form-group">
                      {/* <label className="block mb-2 dark:text-gray-100">Upload file</label> */}
                      <div className="uploadingnote dark:text-[#FFFFFF] text-[#000]">
                        Drag or choose your file to upload
                      </div>
                      <div className="flex justify-center">
                        <div className="w-full px-6 py-3 border-0 rounded-lg uploadingFileDiv focus:outline-none focus:ring-0 text-slate-800 sm:w-11/12 shadow-secondary">
                          <div className="bg-white uploadingSymbolImage text-slate-800">
                            <Icon name="upload-file" size="24" />
                          </div>
                          <div className="uploadingFileFormats dark:text-gray-100">
                            {!selectedFile
                              ? "Suggested image size is 348*200. Image size up to 4MB."
                              : selectedFile.name}
                          </div>
                          <input
                            className="uploadingTempLoaded"
                            type="file"
                            id="fileInput1"
                            onChange={changeFile}
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        onClickUpdateCampaign(e);
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
