import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import axios from "axios";
import Icon from "../components/Icon";
import UserFooter from '../components/user/UserFooter';
import Header from '../components/HeaderHome'
import { chains } from '../smart-contract/chains_constants';
import { backendURL } from '../config';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Confetti from "react-confetti";
const CampaignFactory = require("../smart-contract/build/CampaignFactory.json");
const Campaign = require("../smart-contract/build/Campaign.json");
const Category = require("../config").Category;

export default function CreateCampaign() {
	const [minimum, setMinimum] = useState(0.001);
	const [name, setName] = useState("");
	const [category, setCategory] = useState("Defi");
	const [description, setDescription] = useState("");
	const [target, setTarget] = useState(10);
	const [dropdown, setDropdown] = useState(false);
	const [popup, showPopup] = useState(false);
	const [copied, setCopied] = useState(false);
	const [createdAddress, setCreatedAddress] = useState(undefined);
  	const [selectedFile, setSelectedFile] = useState(null);

	const chainId = useSelector(state => state.auth.currentChainId);
	const account = useSelector(state => state.auth.currentWallet);
	const globalWeb3 = useSelector(state => state.auth.globalWeb3);

	const navigate = useNavigate();

	const onClickCreateCampaign = async () => {
		if (globalWeb3 && account && chainId) {
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
			let idOnDb = null;
			console.log(imagePath);
			if(imagePath !== null)
			{
				await axios({
					method: "post",
					url: `${backendURL}/api/campaign/create`,
					data: {
						name,
						description,
						imageURL: imagePath,
						minimum,
						target,
						creator: account || "",
						category: category,
						address: "",
						chainId: chainId || ""
					}
				}).then((res) => {
					if (res.data && res.data.code === 0) {
						idOnDb = res.data.data._id;
					}
				}).catch((err) => {
					console.error(err);
					//delete image uploaded
				});
			}
			let createdCampaignAddress = null;
			if (idOnDb !== null) {
				try {
					const factory = new globalWeb3.eth.Contract(
						CampaignFactory,
						chains[chainId?.toString()].factoryAddress
					);
					if (factory) {
						await factory.methods.createCampaign(
							globalWeb3.utils.toWei(minimum.toString(), "ether"),
							globalWeb3.utils.toWei(target.toString(), "ether"),
							idOnDb
						)
							.send({
								from: account,
								gas: 3000000
							});
						
						let summary = [], campais = [];
						if (factory) {
							campais = await factory.methods.getDeployedCampaigns().call();
							summary = await Promise.all(
							campais.map((campaign, i) =>
								new globalWeb3.eth.Contract(Campaign, campais[i]).methods.getSummary().call()
							)
							);
						}
						for (let idx = 0; idx < summary.length; idx++) 
						{
						  if (summary[idx][10] == idOnDb) 
						  {
							createdCampaignAddress = campais[idx];
						  }
						}
					} else {
						console.log("creating new campaign : Invalid factoy instance.");
					}
				}
				catch (e) {
					await axios({
						method: "post",
						url: `${backendURL}/api/campaign/delete`,
						data: {
							_id: idOnDb
						}
					}).then((res) => {
						if (res.data && res.data.code === 0) {
						}
					}).catch((err) => {
						console.error(err);
					});
					console.error(e);
					if (e.code && e.code === 4100) NotificationManager.warning("Please unlock your wallet and try again.");
				}
				if (createdCampaignAddress !== null) {
					setCreatedAddress(createdCampaignAddress);
					await axios({
						method: "post",
						url: `${backendURL}/api/campaign/update`,
						data: {
							_id: idOnDb,
							address: createdCampaignAddress,
						}
					}).then((res) => {
						if (res.data && res.data.code === 0) {
							showPopup(!popup);
						}
					}).catch((err) => {
						console.error(err);
					});
				}
			}
		} else {
			console.log("Invalid web3");
		}
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

	const onChangeMinimum = (value) => {
		let previous = minimum;
		if (isNaN(value) === true) setMinimum(previous);
		else setMinimum(Number(value));
	}

	const onChangeTarget = (value) => {
		let previous = minimum;
		if (isNaN(value) === true) setTarget(previous);
		else setTarget(Number(value));
	}

	const onCopyAddress = () => {
		setCopied(true);
		setTimeout(() => {
			setCopied(false)
		}, 1000);
	}

	return (
		<div className=' dark:bg-slate-900 '>
			<Header />
			<section className="heading pt-16 pb-4  dark:bg-slate-900 ">
				<h1 className="text-center text-2xl font-bolder  dark:bg-slate-900 dark:text-white ">Create a new grant</h1>
			</section>
			<section className="form w-10/12 md:w-6/12 mx-auto py-6 ">

				<div className="form-group mb-6 my-3" style={{ display: "flex", flexDirection: "row" }}>
					<div className="block mb-2 dark:text-gray-100">Category</div>
					<div className="relative">
						<button className="sm:ml-3 ml-0 py-2 px-6 text-md leading-5 text-slate-800 bg-gradient-secondary font-bold rounded-full dark:text-gray-100 flex items-center justify-between" type="button"
							onClick={() => { setDropdown(!dropdown) }}
							style={{ minWidth: "200px", textAlign: "center" }}
						> {category || "Select a category"}
							<svg className="ml-3 w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
						{
							dropdown ?
								<div id="dropdown" className="absolute  top-12 z-10 bg-white divide-y divide-gray-100 rounded shadow w-60 dark:bg-gray-700">
									<ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault"
										style={{ overflowY: "scroll", maxHeight: "300px" }}
									>
										{Category.map((i, index) => (
											<li key={index} onClick={(e) => { setCategory(i || "Defi"); setDropdown(!dropdown) }} value={category || ""}>
												<span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{i}</span>
											</li>
										))}
									</ul>
								</div>
								: ''
						}
					</div>
				</div>
				<div className="form-group mb-6 my-3">
					<label className="block mb-2 dark:text-gray-100">Minimum Contribution Amount</label>
					<div className="flex flex-wrap">
						<input type="number" className='bg-white px-6 py-3 rounded-lg focus:outline-none focus:ring-0 text-slate-800 w-full border-0 shadow-secondary sm:w-9/12 md:w-9/12 lg:w-9/12'
							onChange={(e) => { onChangeMinimum(e.target.value) }} value={minimum}
						></input>
						<div className='w-full sm:w-2/12 md:w-2/12 lg:w-2/12 sm:mt-0 mt-4'>
							<button className='ethbtn bg-gradient-primary lg:px-4 px-0 py-3 sm:ml-2 w-full text-white font-bold rounded-lg'>{chainId ? chains[chainId.toString()].nativeCurrency : "ETH"}</button>
						</div>
					</div>
				</div>
				<div className="form-group mb-6 my-3">
					<label className="block mb-2 dark:text-gray-100">Grant Name</label>
					<div className="flex flex-wrap">
						<input type="text" className='bg-white px-6 py-3 rounded-lg focus:outline-none focus:ring-0 text-slate-800 sm:w-11/12 w-full border-0 shadow-secondary'
							onChange={(e) => { setName(e.target.value) }} value={name || ""}
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
				<div className="form-group mb-6 my-3">
					<label className="block mb-2 dark:text-gray-100">Target Amount</label>
					<div className="flex flex-wrap">
						<input type="number" className='bg-white px-6 py-3 rounded-lg focus:outline-none focus:ring-0 text-slate-800 w-full border-0 shadow-secondary sm:w-19/12 md:w-9/12 lg:w-9/12'
							onChange={(e) => { onChangeTarget(e.target.value) }} value={target}
						></input>
						<div className='w-full sm:w-2/12 md:w-2/12 lg:w-2/12 sm:mt-0 mt-4'>
							<button className='ethbtn bg-gradient-primary lg:px-4 px-0 py-3 sm:ml-2 w-full text-white font-bold rounded-lg'>{chainId ? chains[chainId.toString()].nativeCurrency : "ETH"}</button>
						</div>
					</div>
				</div>
				<div className="form-group mb-6 my-3 mt-12">
					<button className='campaignbtn bg-gradient-primary text-white font-bold sm:w-11/12 w-full text-center rounded-lg py-3 px-4 flex justify-center items-center shadow-primary'
						onClick={() => { onClickCreateCampaign() }}
					>Create grant <img src="/images/arrow-right.png" alt="arrow" className='ml-1 h-5' /></button>
				</div>
			</section>

			{popup ? <>
				{/* popup  */}
				<section className="popup fixed w-full top-0 left-0 z-50 min-h-screen flex items-center justify-center">
					<div className="popup-other">
						<div className="container">
							<div className="connect-popup mx-auto">
								<div className="popup-head py-6 px-6 flex justify-between items-center">
									<NavLink className="handcursor closebtn" to="/" onClick={() => { showPopup(!popup); }}>
										<img src="/images/closebtn.png" alt="close" className='ml-auto' />
									</NavLink>
								</div>
								<div className="px-3 text-center">
									<div className='flex justify-center'>
										<img src="/images/creation complete.png" alt="casual" className='mx-auto' />
									</div>
									<h6 className='text-sm md:text-2xl mt-3 mb-1 text-white font-bold'>you have successfully created a new grant!</h6>
									<p className='text-xs md:text-lg mb-5 text-white'>Wishing you the very best</p>
									<div className="flex w-11/12 md:w-8/12 mx-auto input-group">
										<input type="text" disabled id="website-admin" className="rounded-none rounded-l-xl bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-xs border-gray-300 py-3 px-5 placeholder-gray-800" placeholder="Share your grant on Twitter" />
										<CopyToClipboard text={`${window.location.origin}/campaign/${createdAddress}`} onCopy={onCopyAddress}>
											<button className="inline-flex items-center text-sm text-white bg-light-blue rounded-r-xl border-0 border-r-0 px-4 md:px-9 py-3 font-medium">
												{
													copied ? "Copied" : "Share"
												}
											</button>
										</CopyToClipboard>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</> : ''}

			<UserFooter />
			{
				popup && <Confetti />
			}
		</div>
	)
}
