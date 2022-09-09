import React, { useEffect, useState} from 'react'
import Header from '../components/HeaderHome'
import {  NavLink, useNavigate, useParams } from 'react-router-dom';
import {useSelector} from "react-redux";
import {NotificationManager} from "react-notifications";
import UserFooter from '../components/user/UserFooter';
import { chains } from '../smart-contract/chains_constants';
const Campaign = require("../smart-contract/build/Campaign.json");

export default function CreateRequest() {
    const [summary, setSummary] = useState({});
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0.1);
    const [recipient, setRecipient] = useState("");
    
    const chainId = useSelector(state => state.auth.currentChainId);
    const account = useSelector(state => state.auth.currentWallet);
    const globalWeb3 = useSelector(state => state.auth.globalWeb3);
    const navigate = useNavigate();
    const {id} = useParams();

    const getSummary = async () => {
        let campaign = new globalWeb3.eth.Contract(Campaign, id);
        let summary = await campaign.methods.getSummary().call();   
        setSummary(summary);             
    }   

    useEffect(() => {
        if(account && chainId && globalWeb3 && id)
        {     
            getSummary(); 
        }
    }, [chainId, account, globalWeb3, id]);

    const onChangeAmount = (value) => {
        let previous = amount;
        if(isNaN(value) === true) setAmount(previous);
        else setAmount(value);
    }

    const onClickCreateRequest = async () => 
    {        
        if(account && chainId && globalWeb3 && id && amount>0)
        {                 
            try {
                let campaign = new globalWeb3.eth.Contract(Campaign, id);
                if(campaign)
                {
                    await campaign.methods.createRequest(
                        description || "",
                        globalWeb3.utils.toWei(amount.toString(), "ether"),
                        recipient || ""
                    ).send({
                        from: account, 
                        gas: 3000000
                    });
                    navigate(`/campaign/${id}`);
                }
                else{
                    console.log("Finalysing requests: invalid campaign instance");
                }
            } catch (err) {
                console.error(err);
            } finally {
            }
        }else{
            NotificationManager.warning("Please connnect your wallet.");
        }
    }

    return (
    <div className=' bg-slate-900 ' style={{ height:"100vh" }}>
        <Header />

        <section className="head pt-8 pb-4">
            <div className="container">
                <div className="flex justify-between flex-wrap">
                    <NavLink to={`/requests/${id}`} className='flex items-center text-lg font-bold dark:text-gray-100'><span className=''><img className='w-2/3 mt-1' src="/images/arrow-left.png" alt="blue arrow" /></span>Back</NavLink>
                    <h4 className='font-bold my-6 text-lg dark:text-gray-100'>Grant Balance :<span className='text-dark-blue number'> {summary[1]>=0? globalWeb3?.utils.fromWei(summary[1], "ether") : "0"} {chains[chainId?.toString()]?.nativeCurrency} </span> </h4>
                </div>
            </div>
        </section>

        <section className="main py-24 text-center">
            <div className="container">
                <h1 className='dark-text my-4 text-xl font-bold dark:text-gray-100'>Create a withdrawal request</h1>
                <div className="mt-4 ">
                <input type="text" className='bg-white px-6 py-3 rounded-lg focus:outline-none focus:ring-0 text-slate-800 w-full border-0 shadow-secondary sm:w-5/12 md:w-5/12 lg:w-5/12'
                    placeholder='Request description'  
                    onChange={(e) => {setDescription(e.target.value)}} value={description || ""}
                ></input>
                </div>
                <div className="mt-4 ">
                <input type="number" className='bg-white px-6 py-3 rounded-lg focus:outline-none focus:ring-0 text-slate-800 w-full border-0 shadow-secondary sm:w-5/12 md:w-5/12 lg:w-5/12'
                    placeholder='Amount in ETH'  
                    onChange={(e) => {onChangeAmount(e.target.value)}} value={amount}
                ></input>
                </div>
                <div className="mt-4 ">
                <input type="text" className='bg-white px-6 py-3 rounded-lg focus:outline-none focus:ring-0 text-slate-800 w-full border-0 shadow-secondary sm:w-5/12 md:w-5/12 lg:w-5/12'
                    placeholder='Recipient wallet address'  
                    onChange={(e) => {setRecipient(e.target.value)}} value={recipient || ""}
                ></input>
                </div>
                <button className='my-5 campaignbtn bg-gradient-primary text-white  font-bold w-full sm:w-5/12 text-center rounded-lg py-3 px-4 flex justify-center items-center mx-auto'
                    onClick={() => {onClickCreateRequest()}}
                >Create withdrawal request</button>
            </div>
        </section>

        <UserFooter />
    </div>
  )
}
