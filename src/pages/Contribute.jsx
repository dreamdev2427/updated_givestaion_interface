import React, { useEffect, useState } from 'react'
import {  useNavigate, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from 'axios';
import {NotificationManager} from 'react-notifications';
import { backendURL } from '../config';
import UserFooter from '../components/user/UserFooter';
import Header from '../components/HeaderHome';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Confetti from "react-confetti";
import { useMediaQuery } from 'react-responsive';
import { chains } from '../smart-contract/chains_constants';
const CampaignFactory = require("../smart-contract/build/CampaignFactory.json");
const Campaign = require("../smart-contract/build/Campaign.json");

export default function Contribute() {
    const history = useNavigate();
    const [summary, setSummary]  = useState({});
    const [popup, setPopup] = useState(false);
    const [donationAmount, setDonationAmount] = useState(0);
    const [campaignIdOnDB, setCampaignIdOnDB] = useState(null);
    const [copied, setCopied] = useState(false);
    
    const chainId = useSelector(state => state.auth.currentChainId);
    const account = useSelector(state => state.auth.currentWallet);
    const globalWeb3 = useSelector(state => state.auth.globalWeb3);
    const refAddr = useSelector(state => state.auth.referralAddress);

    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    var colorMode = null;
  
    const showLoader = () => {
      
      setTimeout(() => {
        setLoading(false);
        setPopup(!popup);
      }, 2000);
    };
    
    colorMode = localStorage.getItem('color-theme');  

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
                                }
                                setCampaignIdOnDB(summa[10]);
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
                                setCampaignIdOnDB(summaryFromDB._id);
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

    const onChangeDonationAmount = (value) => {
        let previous = donationAmount;
        if(isNaN(value) === true) setDonationAmount(previous);
        else setDonationAmount(value); 
    }

    const onClickContribute = async () => {
        if(donationAmount>0)
        {
            if(globalWeb3 && account)
            {
                try{
                    await new globalWeb3.eth.Contract(Campaign, id).methods.contribute(refAddr).send({
                        from: account,
                        gas: 3000000,
                        value: globalWeb3.utils.toWei(donationAmount.toString(), "ether"),
                    })
                    await axios({
                        method: "post",
                        url: `${backendURL}/api/donation/create`,
                        data: {
                            campaign: campaignIdOnDB || "",
                            amount:Number(donationAmount)*0.98,
                            donor:account || "",
                            chainId:chainId || ""
                        }
                    }).then((res)=>{
                        if(res.data && res.data.code === 0)
                        {
                            setLoading(true);    
                            setTimeout(()=>
                            {          
                                showLoader();
                            }, 2000);          
                        }
                    }).catch((err)=> {
                        console.error(err);    
                    });
                }catch(err)
                {
                    console.error(err);
                    if(err.code && err.code === 4100) NotificationManager.warning("Please unlock your wallet and try again.");
                }

            }
            else{
                NotificationManager.warning("Connect your wallet!");
            }
        }
        else{
            NotificationManager.warning("Please input donation amount!");
        }
    }

    const onCopyAddress = () => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false)
        }, 1000);
      } 

    return (<>
        {
          loading ? 
          <div style={{display:"flex", justifyContent:"center", alignItems:"center", height: "100vh", 
            background:
              (colorMode == null || colorMode == "light")? 
              "white" : "black"
          }}>
          <div className="loader"
            style={{ backgroundImage:
              (colorMode == null || colorMode == "light")? 
                `url('/images/loader-light.gif')`
                :
                `url('/images/loader-dark.gif')`
            }}
          ></div> 
          </div>
          : 
        <div className=' dark:bg-slate-900 '>
            <Header />

            <section className="pt-24 pb-16">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="left">
                            <p className='flex items-center text-sm dark:text-gray-100'>
                                <a target="_blank" rel="noreferrer noopener" 
                                    href={`${chains[chainId?.toString()]?.blockScanUrl}address/${id}`}>View on block scan website</a>
                                <span className='ml-2'><img className='w-2/3' src="/images/blue-arrow.png" alt="blue arrow" /></span>
                            </p>
                            <img className='my-3 rounded-3xl w-full' src={`${backendURL}/${summary[7]}` || "/images/avengers.png"} alt="avengers" />
                            <h4 className='font-bold mt-12 text-lg dark:text-gray-100'>{summary[5] || ""}</h4>
                            <h6 className='my-2.5 text-md dark:text-gray-100'>Description</h6>
                            <p className='mb-3 text-justify dark:text-gray-100'>{summary[6] || ""}</p>
                            <div className="flex flex-wrap items-end mt-6">
                                <div className='w-full sm:w-3/12 md:3/12'>
                                    <label className='mb-3 block text-sm text-center dark:text-gray-100'>Minimum  <br /> Contribution Amount</label>
                                    <input type="text" disabled className='bg-white px-6 py-3 rounded-lg focus:outline-none focus:ring-0 text-slate-800 w-full border-0 shadow-secondary' 
                                        value={summary[0]>0? globalWeb3?.utils.fromWei(summary[0], "ether") : "0"}
                                        onChange={() => {}}
                                    />
                                </div>
                                <div className='w-full sm:w-8/12 md:8/12 sm:ml-5'>
                                    <label className='mb-3 block text-sm text-center dark:text-gray-100'>Creator’s wallet address</label>
                                    <input type="text" disabled className='bg-white px-6 py-3 rounded-lg focus:outline-none focus:ring-0 text-slate-800 w-full border-0 shadow-secondary' 
                                        value={summary[4] || ""}
                                        onChange={() => {}}
                                    />
                                </div>
                            </div>
                            <div className="flex items-end mt-10">
                                <div className='w-full sm:w-3/12 md:3/12 pr-4'>
                                    <label className='mb-5 block text-sm text-center dark:text-gray-100'>Total Requests</label>
                                    <div className='w-16 mx-auto'>
                                        <input type="text" disabled className='bg-white px-6 py-5 rounded-lg focus:outline-none focus:ring-0 text-slate-800 w-full border-0 shadow-secondary' 
                                            value={summary[2] || 0}
                                            onChange={() => {}}
                                        />
                                    </div>
                                </div>
                                <div className='w-full sm:w-3/12 md:3/12'>
                                    <label className='mb-5 block text-sm text-center dark:text-gray-100'>Total Approvers</label>
                                    <div className='w-16 mx-auto'>
                                        <input type="text" disabled className='bg-white px-6 py-5 rounded-lg focus:outline-none focus:ring-0 text-slate-800 w-full border-0 shadow-secondary' 
                                            value={summary[3] || 0}
                                            onChange={() => {}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right pl-0 md:pl-12">
                            <h4 className='font-bold my-6 text-lg value dark:text-gray-100'>Grant Balance</h4>
                            <div className="range my-1">
                                <input type="range" name="range" id='range' min="0" max={summary[8]>=0? globalWeb3?.utils.fromWei(summary[8].toString(), "ether").toString() : "0"} className='w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer' 
                                    value={summary[1]>=0? globalWeb3?.utils.fromWei(summary[1], "ether").toString() : "0"}
                                    onChange={() => {}}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <h4 className='my-6 text-lg value dark:text-gray-100'>{summary[1]>=0? globalWeb3?.utils.fromWei(summary[1], "ether") : "0"} {chains[chainId?.toString()]?.nativeCurrency}</h4>
                                <h4 className='my-6 text-lg value dark:text-gray-100'>Target of {summary[8]>=0? globalWeb3?.utils.fromWei(summary[8], "ether") : "0"} {chains[chainId?.toString()]?.nativeCurrency}</h4>
                            </div>
                            <div className="form mt-5">
                                <input type="number" className='bg-white mb-7 px-6 py-6 rounded-lg focus:outline-none focus:ring-0 text-slate-800 w-full border-0 shadow-secondary' placeholder='Enter amount' 
                                    onChange={(e) => {onChangeDonationAmount(e.target.value)}}
                                />
                                <button className='campaignbtn bg-gradient-primary text-white font-bold w-full text-center rounded-lg py-4 px-4 flex justify-center items-center shadow-primary' 
                                    onClick={() => { onClickContribute(); }}
                                >Contribute</button>
                            </div>
                            <div className="note mt-36 py-2 px-3 bg-primary rounded mb-9">
                                <div className='border-l-4 border-blue-600'>
                                    <p className='pl-4 text-md'>Click the button below to see how funds are being used <br />and if you are a contributor, you can also approve <br /> the withdrawal request.</p>
                                </div>
                            </div>
                            <button className='campaignbtn bg-gradient-primary text-white font-bold w-full text-center rounded-lg py-4 px-4 flex justify-center items-center shadow-primary text-lg'
                                onClick={() => {history(`/requests/${id}`)}}
                            >View Withdrawal Requests</button>
                        </div>
                    </div>
                </div>
            </section>

            {popup ? <>
                {/* popup  */}
                <section className="popup fixed w-full top-0 left-0 z-50 min-h-screen flex items-center justify-center">
                    <div className="popup-other">
                        <div className="container">
                            <div className="connect-popup mx-auto">
                                <div className="popup-head py-6 px-6 flex justify-between items-center">
                                    <div className="closebtn cursor-pointer" onClick={() => { setPopup(!popup); history('/') }}>
                                        <img src="/images/closebtn.png" alt="close" className='ml-auto' />
                                    </div>
                                </div>
                                <div className="px-3 text-center">
                                    <div className='flex justify-center'>
                                        <img src="/images/casual.png" alt="casual" className='mx-auto' />
                                    </div>
                                    <h6 className='text-sm md:text-2xl mt-3 mb-1 text-white font-bold'>Thank you for contributing to this campaign!</h6>
                                    <p className='text-xs md:text-lg mb-5 text-white'>You successfully donated {donationAmount>=0? donationAmount : "0"} {chains[chainId?.toString()]?.nativeCurrency} </p>
                                    <div className="flex w-11/12 md:w-8/12 mx-auto input-group">
                                        <input type="text" disabled id="website-admin" className="rounded-none rounded-l-xl bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-xs border-gray-300 py-3 px-5 placeholder-gray-800" placeholder="Share your success on Twitter" />
                                         <CopyToClipboard text={`${window.location.origin}/campaign/${id}`} onCopy={onCopyAddress}>    
                                            <button className="inline-flex items-center text-sm text-white bg-light-blue rounded-r-xl border-0 border-r-0 px-4 md:px-9 py-3 font-medium">
                                            {
                                                copied ? "Copied": "Share"
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
  }
  </>)
}
