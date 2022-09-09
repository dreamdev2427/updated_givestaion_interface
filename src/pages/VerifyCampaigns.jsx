import React, { useEffect, useState} from 'react'
import Header from '../components/HeaderHome'
import {  NavLink, useNavigate, useParams } from 'react-router-dom';
import {useSelector} from "react-redux";
import {NotificationManager} from "react-notifications";
import UserFooter from '../components/user/UserFooter';
import { chains } from '../smart-contract/chains_constants';
import axios from 'axios';
import { backendURL } from '../config';
const CampaignFactory = require("../smart-contract/build/CampaignFactory.json");
const Campaign = require("../smart-contract/build/Campaign.json");

export default function VerifyCampaigns() {
    const [summary, setSummary] = useState({});
    const [campaigns, setCampaigns] = useState([]);
    
    const chainId = useSelector(state => state.auth.currentChainId);
    const account = useSelector(state => state.auth.currentWallet);
    const globalWeb3 = useSelector(state => state.auth.globalWeb3);
    const navigate = useNavigate();

    const getSummaryFromDB = async () => {
        await axios({
            method: "post",
            url: `${backendURL}/api/campaign/all`,
            data: {
            }
          }).then((res)=>{
            if(res.data && res.data.code === 0)
            {
                let summa = [], campais = [];
                let summaryFromDB = res.data.data || [];
                if(summaryFromDB.length>0)
                {
                    for(let idx = 0; idx<summaryFromDB.length; idx++)
                    {
                        let found = summaryFromDB[idx] || undefined;
                        if(found)
                        {
                            summa[idx] = found;
                            campais[idx] = found.address;
                        }
                    }
                }
                setSummary(summa);
                setCampaigns(campais);
            }
        }).catch((err)=> {
            console.error(err);    
        });
    }

    useEffect(() => {
            getSummaryFromDB();
    }, []);
    
  const onClickVerify = async (index, flag) => {
    if(account && chainId && globalWeb3)
    { 
        try {
            const factory = new globalWeb3.eth.Contract(
                CampaignFactory,
                chains[chainId?.toString()].factoryAddress
            );
            if(factory)
            {
                let owner = await factory.methods.owner().call();
                if(owner.toString().toLowerCase() === account.toString().toLowerCase())
                {
                    await factory.methods.setVerification(campaigns[index], flag).send({
                        from: account,
                        gas: 3000000
                    });
                    await axios({
                        method: "post",
                        url: `${backendURL}/api/campaign/update`,
                        data: {
                            _id: summary[index]._id,
                            verified: flag
                        }
                        }).then((res)=>{
                            if(res.data && res.data.code === 0)
                            {   
                            }
                        }).catch((err)=> {
                            console.error(err);    
                        });
                    getSummaryFromDB();
                }
            }else{
                console.log("creating a approve request : Invalid campaign instance");
            }
        } catch (err) {
            console.error(err);
            if(err.code && err.code === 4100) NotificationManager.warning("Please unlock your wallet and try again.");            
        } finally {

        }
    }else{
        NotificationManager.warning("Please connect your wallet.");    
    }
  };

    return (
    <div className=' dark:bg-slate-900 '>
        <Header />

        <section className="head pt-8 pb-4">
            <div className="container">
                <div className="flex justify-between flex-wrap">
                    <NavLink to={`/`} className='flex items-center text-lg font-bold dark:text-gray-100'><span className=''><img className='w-2/3 mt-1' src="/images/arrow-left.png" alt="blue arrow" /></span>Back</NavLink>                    
                </div>
                { campaigns.length>0 &&                     
                    <div className="flex my-6 justify-between flex-wrap px-8">
                        <p className='flex items-center text-2xl font-bold  dark:text-white'>Number of deployed campaigns {campaigns && campaigns.length? campaigns.length : "0"}</p>
                    </div>
                }
            </div>
        </section>

        { summary.length > 0 && 
            
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
                                        Address
                                    </th>
                                    <th scope="col" className="px-6 py-6">
                                        Title
                                    </th>
                                    <th scope="col" className="px-6 py-6">
                                        Creator
                                    </th>
                                    <th scope="col" className="px-6 py-6 text-center">
                                        Verify
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='text-gray-300'>
                                {summary.map((item, index) =>(
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
                                            {campaigns[index] || ""}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.name || ""}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.creator || ""}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            { item.verified === false && 
                                                <div className="font-bold px-3 py-1.5 rounded bg-green text-white" style={{userSelect: "none", cursor:"pointer"}} 
                                                    onClick={() =>{ onClickVerify(index, true)}}
                                                >Verify</div>
                                            }
                                            { item.verified === true &&                                                 
                                                <div className="font-bold px-3 py-1.5 rounded bg-green text-white" style={{userSelect: "none", cursor:"pointer"}} 
                                                    onClick={() =>{onClickVerify(index, false)}}
                                                >Unverify</div>
                                            }
                                            {
                                                (item.verified === undefined ||  item[9] === null) && 
                                                <div className="font-bold px-3 py-1.5 rounded bg-green text-white" style={{userSelect: "none", cursor:"pointer"}}                                                     
                                                >No verifiction</div>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        }

        <UserFooter />
    </div>
  )
}
