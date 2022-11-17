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
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const CampaignFactory = require("../smart-contract/build/CampaignFactory.json");
const Campaign = require("../smart-contract/build/Campaign.json");
const Category = require("../config").Category;

export default function CreateCampaign() {
	const [editorState, setEditorState] = useState( EditorState.createEmpty() );
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
	const [websiteurl, setWebsiteURL] = useState("");
	const [twitterurl, setTwitterURL] = useState("");
	const [telegramurl, setTelegramURL] = useState("");

	const chainId = useSelector(state => state.auth.currentChainId);
	const account = useSelector(state => state.auth.currentWallet);
	const globalWeb3 = useSelector(state => state.auth.globalWeb3);

	const navigate = useNavigate();

	const onEditorStateChange = (editorState) => {
		setEditorState(editorState);
		setDescription(draftToHtml(convertToRaw(editorState.getCurrentContent())) || "");
	};

	const onClickCreateCampaign = async () => {
		if(name === "" )
		{
			NotificationManager.warning("Please input name.");
			return;
		}
		if(description == "")
		{
			NotificationManager.warning("Please input description.");
			return;
		}
		if(selectedFile == null)
		{
			NotificationManager.warning("Please input a image.");
			return;
		}
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
						twitterurl: twitterurl,
						websiteurl: websiteurl,
						telegramurl: telegramurl,
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
			console.log(idOnDb);
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
					console.error(e);
					await axios({
						method: "post",
						url: `${backendURL}/api/campaign/delete`,
						data: {
							campainId: idOnDb,
							creator: account || ""
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
			NotificationManager.warning("Please connect your wallet.");
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
		<div className=' dark:bg-slate-900'>
			<Header />
			<section className="pt-16 pb-4 heading dark:bg-slate-900 ">
				<h1 className="text-2xl text-center font-bolder dark:bg-slate-900 dark:text-white ">Create a new grant</h1>
			</section>
			<section className="w-10/12 py-6 mx-auto form md:w-6/12 ">

				<div className="my-3 mb-6 form-group" style={{ display: "flex", flexDirection: "row" }}>
					<div className="block mb-2 dark:text-gray-100">Category</div>
					<div className="relative">
						<button className="flex items-center justify-between px-6 py-2 ml-0 font-bold leading-5 rounded-full sm:ml-3 text-md text-slate-800 bg-gradient-secondary dark:text-gray-100" type="button"
							onClick={() => { setDropdown(!dropdown) }}
							style={{ minWidth: "200px", textAlign: "center" }}
						> {category || "Select a category"}
							<svg className="w-4 h-4 ml-2 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
						{
							dropdown ?
								<div id="dropdown" className="absolute z-10 bg-white divide-y divide-gray-100 rounded shadow top-12 w-60 dark:bg-gray-700">
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
				<div className="my-3 mb-6 form-group">
					<label className="block mb-2 dark:text-gray-100">Minimum Contribution Amount</label>
					<div className="flex flex-wrap">
						<input type="number" className='w-full py-3 bg-white border-0 rounded-lg focus:outline-none focus:ring-0 text-slate-800 shadow-secondary sm:w-10/12 md:w-10/12 lg:w-10/12'
							onChange={(e) => { onChangeMinimum(e.target.value) }} value={minimum}
						></input>
						<div className='w-full mt-4 sm:w-2/12 md:w-2/12 lg:w-2/12 sm:mt-0'>
							<button className='w-full px-0 py-3 font-bold text-white rounded-lg ethbtn bg-gradient-primary lg:px-4 sm:ml-2'>{chainId ? chains[chainId.toString()].nativeCurrency : "ETH"}</button>
						</div>
					</div>
				</div>
				<div className="my-3 mb-6 form-group">
					<label className="block mb-2 dark:text-gray-100">Grant Name</label>
					<div className="flex flex-wrap">
						<input type="text" className='w-full py-3 bg-white border-0 rounded-lg focus:outline-none focus:ring-0 text-slate-800 sm:w-12/12 shadow-secondary'
							onChange={(e) => { setName(e.target.value) }} value={name || ""}
						/>
					</div>
				</div>
				<div className="my-3 mb-6 form-group">
					<label className="block mb-2 dark:text-gray-100">Grant Description</label>
				<Editor
					editorState={editorState}
					wrapperClassName="demo-wrapper"
					editorClassName="demo-editor min-h-300"
					onEditorStateChange={onEditorStateChange}
					/>
				</div>
				<div className="my-3 mb-6 form-group">
					<label className="block mb-2 dark:text-gray-100">Target Amount</label>
					<div className="flex flex-wrap">
						<input type="number" className='w-full py-3 bg-white border-0 rounded-lg focus:outline-none focus:ring-0 text-slate-800 shadow-secondary sm:w-10/12 md:w-10/12 lg:w-10/12'
							onChange={(e) => { onChangeTarget(e.target.value) }} value={target}
						></input>
						<div className='w-full mt-4 sm:w-2/12 md:w-2/12 lg:w-2/12 sm:mt-0'>
							<button className='w-full px-0 py-3 font-bold text-white rounded-lg ethbtn bg-gradient-primary lg:px-4 sm:ml-2'>{chainId ? chains[chainId.toString()].nativeCurrency : "ETH"}</button>
						</div>
					</div>
				</div>
				<div className="my-3 mb-6 form-group">
					{/* <label className="block mb-2 dark:text-gray-100">Upload file</label> */}
					<div className="uploadingnote dark:text-gray-100">
            			Drag or choose your file to upload
					</div>
					<div className="w-full py-3 border-0 rounded-lg uploadingFileDiv focus:outline-none focus:ring-0 text-slate-800 sm:w-12/12 shadow-secondary">
						<div className="bg-white uploadingSymbolImage text-slate-800">
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
				<div className="flex flex-row my-1 form-group">
					<label className="block w-4/12 mb-2 text-center sm:w-12/12 dark:text-gray-100 ">Website/Github</label>
					<label className="block w-4/12 mb-2 text-center sm:w-12/12 dark:text-gray-100">Twitter</label>
					<label className="block w-4/12 mb-2 text-center sm:w-12/12 dark:text-gray-100">Telegram</label>
				</div>				
				<div className="flex flex-row my-1 mb-6 form-group">
					<input type="text" className='w-4/12 py-3 mx-1 bg-white border-0 rounded-lg focus:outline-none focus:ring-0 text-slate-800 sm:w-12/12 shadow-secondary'
						onChange={(e) => setWebsiteURL(e.target.value)} value={websiteurl}
					/>
					<input type="text" className='w-4/12 py-3 mx-1 bg-white border-0 rounded-lg focus:outline-none focus:ring-0 text-slate-800 sm:w-12/12 shadow-secondary'
						onChange={(e) => setTwitterURL(e.target.value)} value={twitterurl}
					/>
					<input type="text" className='w-4/12 py-3 mx-1 bg-white border-0 rounded-lg focus:outline-none focus:ring-0 text-slate-800 sm:w-12/12 shadow-secondary'
						onChange={(e) => setTelegramURL(e.target.value)} value={telegramurl}
					/>
				</div>
				<div className="my-3 mt-12 mb-6 form-group">
					<button className='flex items-center justify-center w-full py-3 font-bold text-center text-white rounded-lg campaignbtn bg-gradient-primary sm:w-12/12 shadow-primary'
						onClick={() => { onClickCreateCampaign() }}
					>Create grant <img src="/images/arrow-right.png" alt="arrow" className='h-5 ml-1' /></button>
				</div>
			</section>

			{popup ? <>
				{/* popup  */}
				<section className="fixed top-0 left-0 z-50 flex items-center justify-center w-full min-h-screen popup">
					<div className="popup-other">
						<div className="container">
							<div className="mx-auto connect-popup">
								<div className="flex items-center justify-between px-6 py-6 popup-head">
									<NavLink className="handcursor closebtn" to="/" onClick={() => { showPopup(!popup); }}>
										<img src="/images/closebtn.png" alt="close" className='ml-auto' />
									</NavLink>
								</div>
								<div className="px-3 text-center">
									<div className='flex justify-center'>
										<img src="/images/creation complete.png" alt="casual" className='mx-auto' />
									</div>
									<h6 className='mt-3 mb-1 text-sm font-bold text-white md:text-2xl'>you have successfully created a new grant!</h6>
									<p className='mb-5 text-xs text-white md:text-lg'>Wishing you the very best</p>
									<div className="flex w-11/12 mx-auto md:w-8/12 input-group">
										<input type="text" disabled id="website-admin" className="flex-1 block w-full min-w-0 px-5 py-3 text-xs text-gray-900 placeholder-gray-800 border border-gray-300 rounded-none rounded-l-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Share your grant on Twitter" />
										<CopyToClipboard text={`${window.location.origin}/campaign/${createdAddress}`} onCopy={onCopyAddress}>
											<button className="inline-flex items-center px-4 py-3 text-sm font-medium text-white border-0 border-r-0 bg-light-blue rounded-r-xl md:px-9">
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
