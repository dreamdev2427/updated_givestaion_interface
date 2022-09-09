import React, { useEffect, useState} from 'react'
import Header from '../components/HeaderHome'
import {  NavLink, useNavigate, useParams } from 'react-router-dom';
import {useSelector} from "react-redux";
import {NotificationManager} from "react-notifications";
import UserFooter from '../components/user/UserFooter';
import { chains } from '../smart-contract/chains_constants';
import axios from 'axios';
import { backendURL } from '../config';
const Campaign = require("../smart-contract/build/Campaign.json");

export default function ViewRequests() {
    const [requests, setRequests] = useState([]);
    const [summary, setSummary] = useState({});
    const [campaignIdOnDB, setCampaignIdOnDB] = useState(null);
    
    const chainId = useSelector(state => state.auth.currentChainId);
    const account = useSelector(state => state.auth.currentWallet);
    const globalWeb3 = useSelector(state => state.auth.globalWeb3);
    const navigate = useNavigate();
    const {id} = useParams();

    const getRequestsFromCampaign = async () => {
        let campaign = new globalWeb3.eth.Contract(Campaign, id);
        let summary = await campaign.methods.getSummary().call();   
        setSummary(summary);             
        let requests = await Promise.all(
            Array(parseInt(summary[2]))
            .fill()
            .map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );
        setRequests(requests); 
        
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
                        setCampaignIdOnDB(summaryFromDB._id);
                    }
                }
            }).catch((err)=> {
                console.error(err);    
            });
    }   

    useEffect(() => {
        if(account && chainId && globalWeb3 && id)
        {     
            getRequestsFromCampaign(); 
        }
    }, [chainId, account, globalWeb3, id]);
    
  const onApprove = async (index) => {
    if(account && chainId && globalWeb3 && id)
    { 
        try {
            let campaign = new globalWeb3.eth.Contract(Campaign, id);
            if(campaign)
            {
                await campaign.methods.approveRequest(index).send({
                    from: account,
                    gas: 3000000
                });
                getRequestsFromCampaign();
            }else{
                console.log("creating a approve request : Invalid campaign instance");
            }
        } catch (err) {
            console.error(err);
            if(err.code && err.code === 4100) NotificationManager.warning("Please unlock your wallet and try again.");
        } finally {

        }
    }
  };

  const onFinalize = async (index) => {
    if(account && chainId && globalWeb3 && id)
    { 
        try {
            let campaign = new globalWeb3.eth.Contract(Campaign, id);
            if(campaign)
            {
                await campaign.methods.finalizeRequest(index).send({
                    from: account, 
                    gas: 3000000
                });
                let reducedBalance = Number(summary[1]) - Number(globalWeb3.utils.toWei(requests[index].value.toString() , "ether")); 
                reducedBalance = reducedBalance>0? Number(globalWeb3.utils.fromWei(reducedBalance.toString(), "ether")) : 0;
                await axios({
                    method: "post",
                    url: `${backendURL}/api/campaign/update`,
                    data: {
                        _id: campaignIdOnDB,
                        raised: reducedBalance
                    }
                    }).then((res)=>{
                        if(res.data && res.data.code === 0)
                        {   
                        }
                    }).catch((err)=> {
                        console.error(err);    
                    });
                getRequestsFromCampaign();
            }
            else{
                console.log("Finalysing requests: invalid campaign instance");
            }
        } catch (err) {
            console.error(err);
            if(err.code && err.code === 4100) NotificationManager.warning("Please unlock your wallet and try again.");
        } finally {
        }
    }
  };


    return (
    <div className=' dark:bg-slate-900 ' style={{ height:"100vh"}}>
        <Header />

        <section className="head pt-8 pb-4">
            <div className="container">
                <div className="flex justify-between flex-wrap">
                    <NavLink to={`/campaign/${id}`} className='flex items-center text-lg font-bold dark:text-gray-100'><span className=''><img className='w-2/3 mt-1' src="/images/arrow-left.png" alt="blue arrow" /></span>Back</NavLink>
                    <h4 className='font-bold my-6 text-lg dark:text-gray-100'>Grant Balance :<span className='text-dark-blue number'> {summary[1]>=0? globalWeb3?.utils.fromWei(summary[1], "ether") : "0"} {chains[chainId?.toString()]?.nativeCurrency} </span> </h4>
                </div>
                { requests.length>0 &&                     
                    <div className="flex my-6 justify-between flex-wrap px-8">
                        <p className='flex items-center text-2xl font-bold dark:text-white'>Withdrawal Request for {summary[6] || ""}</p>
                        <button className='my-5 campaignbtn bg-gradient-primary text-white font-bold w-full sm:w-4/12 text-center rounded-lg py-3 px-4 flex justify-center items-center'
                            onClick={() => {navigate(`/create-request/${id}`)}}
                        >Create withdrawal request</button>
                    </div>
                }
            </div>
        </section>

        { requests.length > 0 ? <>
            
            <section className="main">
                <div className="container">
                    <div className="relative overflow-x-auto shadow-md bg-dark py-4">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 py-5 pb-10">
                            <thead className="text-xs text-gray-300 uppercase dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className=" px-4 py-6">
                                        <div className="flex items-center">
                                            <input type="checkbox" className="w-4 h-4 text-blue-600 bg-dark border-gray-700 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-6">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-6">
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-6">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-6">
                                    Recipient Wallet Address
                                    </th>
                                    <th scope="col" className="px-6 py-6">
                                    Aprroval Count
                                    </th>
                                    <th scope="col" className="px-6 py-6 text-center">
                                    APPROVE
                                    </th>
                                    <th scope="col" className="px-6 py-6 text-center">
                                    FINALIZE
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='text-gray-300'>
                                {requests.map((item, index) =>(
                                    <tr className="dark:bg-gray-800 py-8" key={index}>
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-dark border-gray-700 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 font-medium dark:text-white whitespace-nowrap">
                                            {item.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.value>=0? globalWeb3?.utils.fromWei(item.value, "ether").toString() : "0"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.recipient}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.approvalCount}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            { item.complete === false ?
                                                <div className="font-bold px-3 py-1.5 rounded bg-yellow text-white" style={{userSelect: "none", cursor:"pointer"}} 
                                                    onClick={() =>{onApprove(index)}}
                                                >Approve</div>
                                                :
                                                <div></div>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            { item.complete === false ?
                                                <div className="font-bold px-3 py-1.5 rounded bg-green text-white" style={{userSelect: "none", cursor:"pointer"}} 
                                                    onClick={() =>{onFinalize(index)}}
                                                >Finalize</div>
                                                :
                                                <div className="font-bold px-3 py-1.5 text-white" style={{userSelect: "none", cursor:"pointer"}}                                                    
                                                >Completed</div>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </section>

        </>:<>
            <section className="main py-24 text-center">
                <div className="container">
                    <h1 className='dark-text my-4 text-xl font-bold dark:text-gray-100'>No request for this grant</h1>
                    <p className='dark-text mb-4 text-lg dark:text-gray-100'>Kindly create a withdrawal request to withdraw funds from this campaign.</p>
                    <button className='my-5 campaignbtn bg-gradient-primary text-white  font-bold w-full sm:w-5/12 text-center rounded-lg py-3 px-4 flex justify-center items-center mx-auto'
                        onClick={() => {navigate(`/create-request/${id}`)}}
                    >Create withdrawal request</button>
                    <button className='my-5 campaignbtn bg-gray-gradient text-white font-bold w-full sm:w-5/12 text-center rounded-lg py-3 px-4 flex justify-center items-center mx-auto' 
                        onClick={() => {navigate(`/campaign/${id}`)}}
                    >Back to grant</button>
                </div>
            </section>

        </>}

        <UserFooter />
    </div>
  )
}
