import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import axios from "axios";
import Icon from "../../components/Icon";
import UserFooter from "../../components/user/UserFooter";
import { chains } from '../../smart-contract/chains_constants';
import { backendURL } from '../../config';
import { useEffect } from 'react';
const CampaignFactory = require("../../smart-contract/build/CampaignFactory.json");
const Category = require("../../config").Category;
const Campaign = require("../../smart-contract/build/Campaign.json");

export default function UpdateCampaign() {
	const [category, setCategory] = useState("Defi");
	const [description, setDescription] = useState("");
	const [imageURL, setImageURL] = useState("");
	const [dropdown, setDropdown] = useState(false);
	const [idOnDB, setIdOnDB] = useState(null);
	const [summary, setSummary] = useState({});
	const [selectedFile, setSelectedFile] = useState(null);

	const chainId = useSelector(state => state.auth.currentChainId);
	const account = useSelector(state => state.auth.currentWallet);
	const globalWeb3 = useSelector(state => state.auth.globalWeb3);

	const navigate = useNavigate();

    const {id} = useParams();

    useEffect(() => {
        if(account && chainId && globalWeb3 && id)
        {
            const getSummary = async () => {
                try{
                    const factory = new globalWeb3.eth.Contract(
                        CampaignFactory,
                        chains[chainId?.toString()].factoryAddress
                    );
                    let summa = null;
                    if(factory)
                    {
                        summa = await new globalWeb3.eth.Contract(Campaign, id).methods.getSummary().call();         
                    }
                    if(summa !== null)
                    {                        
                        await axios({
                        method: "post",
                        url: `${backendURL}/api/campaign/all`,
                        data: {
                            chainId:chainId || "",
                            address:id
                        }
                        }).then((res)=>{
                            if(res.data && res.data.code === 0)
                            {
                                let summaryFromDB = res.data.data[0] || [];
                                if(summaryFromDB !== undefined)
                                {
                                    summa[5] = summaryFromDB.name;
                                    summa[6] = summaryFromDB.description;
                                    summa[7] = summaryFromDB.imageURL;
                                    summa[9] = summaryFromDB.verified;
                                    summa[11] = summaryFromDB.category;
                                    summa[12] = summaryFromDB.raised;
                                    setIdOnDB(summaryFromDB._id);
									setCategory(summaryFromDB.category);
									setDescription(summaryFromDB.description);
									setImageURL(summaryFromDB.imageURL);
                                }
                                setSummary(summa);
                            }
                        }).catch((err)=> {
                            console.error(err);    
                        });
                    }
                }
                catch(e)
                {
                    console.error(e);
                }
            }
            getSummary();
        }
        else if(id){
            const getSummaryFromDB = async () => {                 
                await axios({
                    method: "post",
                    url: `${backendURL}/api/campaign/all`,
                    data: {
                        chainId:chainId || "",
                        address:id
                    }
                    }).then((res)=>{
                        if(res.data && res.data.code === 0)
                        {   
                            let summa = {};
                            let summaryFromDB = res.data.data[0] || [];
                            if(summaryFromDB !== undefined)
                            {
                                summa[5] = summaryFromDB.name;
                                summa[6] = summaryFromDB.description;
                                summa[7] = summaryFromDB.imageURL;
                                summa[9] = summaryFromDB.verified;
                                summa[11] = summaryFromDB.category;
                                summa[12] = summaryFromDB.raised;
                                setIdOnDB(summaryFromDB._id);
								setCategory(summaryFromDB.category);
								setDescription(summaryFromDB.description);
								setImageURL(summaryFromDB.imageURL);
                            }
                            setSummary(summa);
                        }
                    }).catch((err)=> {
                        console.error(err);    
                    });
            }
            getSummaryFromDB();
        }
    }, [account, chainId, globalWeb3, id]);

	const onClickUpdateCampaign = async () => 
	{
		let imagePath = null;
			const formData = new FormData();
			formData.append("itemFile", selectedFile);
			formData.append("authorId", "hch");
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
					// return;
				})
			console.log(imagePath);
			await axios({
				method: "post",
				url: `${backendURL}/api/campaign/update`,
				data: {
					_id: idOnDB,
					description:description,
					imageURL:imagePath !== null? imagePath:imageURL,
					category: category,
				}
			}).then((res) => {
				if (res.data && res.data.code === 0) {
					NotificationManager.success("Camapaign is updated!");
					navigate(`/myprojects`);
				}
			}).catch((err) => {
				console.error(err);
			});		
	}

	const changeFile = (event) => {
		var file = event.target.files[0];
		if (file == null) return;
		console.log(file);
		setSelectedFile(file);
		let reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
		};
		reader.onerror = function (error) {
		}
	}

	return (
		<div className="py-20 px-10 wholeWrapper">
			<div className="flex items-center pageHead">
				<h1 className="text-slate-900 dark:text-white font-bold overview">Update your project</h1>
				<div className="accountNo ml-7" style={{ textAlign: "center" }}>
					{account && <h2>{account.toString().substring(0, 6) + "..." + account.toString().substring(38, 42)}</h2>}
				</div>
			</div>
			<section className="form w-10/12 md:w-6/12 mx-auto py-6">
				<div className="form-group mb-6 my-3" 
					// style={{ display: "flex", flexDirection: "row" }}
				>
					<label className="block mb-2 dark:text-gray-100">Category</label>
					<div className="flex flex-wrap">
						<input type="text" className='bg-white px-6 py-3 rounded-lg focus:outline-none focus:ring-0 text-slate-800 sm:w-11/12 w-full border-0 shadow-secondary'
							onChange={(e) => { setCategory(e.target.value) }} value={category || ""}
						/>
					</div>
				</div>
				<div className="form-group mb-6 my-3">
					<label className="block mb-2 dark:text-gray-100">Grant Description</label>
					<div className="flex flex-wrap">
						<textarea type="text" className='bg-white px-6 py-3 rounded-lg focus:outline-none focus:ring-0 text-slate-800 sm:w-11/12 w-full border-0 shadow-secondary'
							onChange={(e) => { setDescription(e.target.value) }} value={description || ""}
						/>
					</div>
				</div>
				<div className="form-group mb-6 my-3">
				
					{/* <label className="block mb-2 dark:text-gray-100">Upload file</label> */}
					<div className="uploadingnote dark:text-gray-100">
            Drag or choose your file to upload
					</div>
					<div className="uploadingFileDiv px-6 py-3 rounded-lg focus:outline-none focus:ring-0 text-slate-800 sm:w-11/12 w-full border-0 shadow-secondary">
						<div className="uploadingSymbolImage bg-white text-slate-800">
							<Icon name="upload-file" size="24" />
						</div>
						<div className="uploadingFileFormats dark:text-gray-100">
							{
								!selectedFile ?
									"Suggested image size is 348*200. Image size up to 4MB."
									:
									selectedFile.name
							}
						</div>
						<input className="uploadingTempLoaded" type="file" id="fileInput1" onChange={changeFile}
							accept="image/*"
						/>
					</div>
				</div>
				<div className="form-group mb-6 my-3 mt-12 flex justify-center">
					<button className="updateCampaignBtn flex justify-center items-center " onClick={() => { onClickUpdateCampaign() }}>
						<p className='text-slate-800'>Update</p>
						<svg
							width="6"
							height="9"
							viewBox="0 0 6 9"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M1.5 7.5L4.5 4.5L1.5 1.5"
								stroke="black"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				</div>
			</section>
			<UserFooter  style={{ backgroundColor:"transparent" }} />

		</div>
	)
}
