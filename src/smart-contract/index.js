import Web3 from "web3";
import { store } from "../store";
import { BSC_CHAIN_ID, chains, DEFAULT_CHAIN_ID, OPTIMISTIC_CHAIN_ID, POLYGON_CHAIN_ID, GNOSIS_CHAIN_ID } from "../smart-contract/chains_constants";
import {setConnectedWalletAddress, setWalletStatus, updateGlobalWeb3, setConnectedChainId, updateBalanceOfUser } from "../store/actions/auth.actions"; 
import isEmpty from "../utilities/isEmpty";
import { getGlobalWeb3 } from "../store/reducers/auth.reducers";

export const loadWeb3 = async () => 
{
  if(typeof window !== "undefined")
  {
    window.addEventListener('load', async () => {
      try {
          await window.ethereum.enable();
      } catch (error) {}
    });
    try{
      var web3 = {};
      if (window?.ethereum) 
      {
        web3 = new Web3(window.ethereum);
        web3.eth.handleRevert = true;
      } 
      else if (window?.web3) 
      {
        web3 = new Web3(Web3.givenProvider);
        web3.eth.handleRevert = true;
      } 
      else {
        window.alert(
          "Non-Ethereum browser detected. Please connect and unlock your wallet."
        );
        return;
      }
      store.dispatch(updateGlobalWeb3(web3));
      if (window.ethereum) {
        web3.eth.getChainId().then((chainId) => {
          checkNetworkById(chainId);
          if (web3.utils.toHex(chainId) === web3.utils.toHex(BSC_CHAIN_ID) || 
          web3.utils.toHex(chainId) === web3.utils.toHex(POLYGON_CHAIN_ID) || 
          web3.utils.toHex(chainId) === web3.utils.toHex(OPTIMISTIC_CHAIN_ID) ||
          web3.utils.toHex(chainId) === web3.utils.toHex(GNOSIS_CHAIN_ID))  connectWallet();
        })
        window.ethereum.on('chainChanged', function (chainId) {
          checkNetworkById(chainId);
          if (web3.utils.toHex(chainId) === web3.utils.toHex(BSC_CHAIN_ID) || 
          web3.utils.toHex(chainId) === web3.utils.toHex(POLYGON_CHAIN_ID) || 
          web3.utils.toHex(chainId) === web3.utils.toHex(OPTIMISTIC_CHAIN_ID) ||
          web3.utils.toHex(chainId) === web3.utils.toHex(GNOSIS_CHAIN_ID))  connectWallet();
        });
        window.ethereum.on('disconnect', function(error  /*:ProviderRpcError*/) {
          //alert("disconnected, " + error);      
          store.dispatch(setConnectedWalletAddress(0));
          store.dispatch(setWalletStatus(false));
        });
        window.ethereum.on('accountsChanged', function(accounts /*: Array<string>*/) {
          //  alert("wallet "+accounts[0]+" is connected");
          if(accounts[0]   !== undefined)
          {
            store.dispatch(setConnectedWalletAddress(accounts[0]));
            store.dispatch(setWalletStatus(true));
          }
          if(accounts.length === 0) store.dispatch(setWalletStatus(false));
        });
      }
    }catch(e){
      console.log("Exception in loadWeb3() : ", e);
    }
  }
};

export const checkNetwork = async () => {
  let state = store.getState();
  let globalWeb3 = getGlobalWeb3(state) || window?.web3;
  if (globalWeb3) {
    const chainId = await globalWeb3.eth?.getChainId();
    return checkNetworkById(chainId);
  }
}

export const checkNetworkById = async (chainId) => {
  let state = store.getState();
  let globalWeb3 = getGlobalWeb3(state) || window?.web3;
  if(globalWeb3)
  {
    if (globalWeb3.utils.toHex(chainId) !== globalWeb3.utils.toHex(BSC_CHAIN_ID) && 
    globalWeb3.utils.toHex(chainId) !== globalWeb3.utils.toHex(POLYGON_CHAIN_ID) && 
    globalWeb3.utils.toHex(chainId) !== globalWeb3.utils.toHex(OPTIMISTIC_CHAIN_ID) &&
    globalWeb3.utils.toHex(chainId) !== globalWeb3.utils.toHex(GNOSIS_CHAIN_ID)) 
    {   
      return false; 
    }
    else {
      const cid = await globalWeb3.eth.getChainId();
      store.dispatch(setConnectedChainId(cid));
      return true;
    }
    // return (globalWeb3.utils.toHex(cid) === globalWeb3.utils.toHex(BSC_CHAIN_ID) || 
    // globalWeb3.utils.toHex(chainId) === globalWeb3.utils.toHex(POLYGON_CHAIN_ID) || 
    // globalWeb3.utils.toHex(chainId) === globalWeb3.utils.toHex(OPTIMISTIC_CHAIN_ID) || 
    // globalWeb3.utils.toHex(chainId) === globalWeb3.utils.toHex(GNOSIS_CHAIN_ID)
    // )
  }else return false;
}

export const changeNetwork = async (chainId = null) => 
{
  let state = store.getState();
  let globalWeb3 = getGlobalWeb3(state) || window?.web3;
  if(globalWeb3)
  {
  try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: globalWeb3.utils.toHex(chainId === null? DEFAULT_CHAIN_ID: chainId) }],
      })
    } 
    catch (switchError) 
    {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) 
      {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: globalWeb3.utils.toHex(chainId === null? DEFAULT_CHAIN_ID: chainId),
                chainName: 'Network this site works on',
                rpcUrls: chains[chainId === null? DEFAULT_CHAIN_ID: chainId.toString()].rpcUrl /* ... */,
              },
            ],
          })

          return {
            success : true,
            message : "switching succeed"
          }
        } catch (addError) {          
          return {
            success : false,
            message : "Switching failed." + addError.message
          }
        }
      }
    }
  }else{            
    return {
      success : false,
      message : "Switching failed. Invalid web3"
    }
  }
}

export const connectWallet = async () => 
{
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        success: true,
        message: "Metamask successfuly connected.",
        address: addressArray[0],
      };
      checkNetwork();
      store.dispatch(setWalletStatus(true));
      store.dispatch(setConnectedWalletAddress(addressArray[0]));
      return obj;
    } catch (err) {
      store.dispatch(setWalletStatus(false));
      return {
        success: false,
        address: "",
        message: err.message,
      };
    }
  }
  else {
    store.dispatch(setWalletStatus(false));
    return {
      success: false,
      address: "",
      message: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual BSC wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getValidWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        store.dispatch(setWalletStatus(true));
        return {
          success: true,
          address: addressArray[0],
          status: "Fill in the text-field above.",
        };
      } else {
        store.dispatch(setWalletStatus(false));
        return {
          success: false,
          address: "",
          status: "🦊 Please connect to Metamask.",
        };
      }
    } catch (err) {
      store.dispatch(setWalletStatus(false));
      return {
        success: false,
        address: "",
        status: err.message,
      };
    }
  } else {
    store.dispatch(setWalletStatus(false));
    return {
      success: false,
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual BSC wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getBalanceOfAccount = async (address) => 
{
  let state = store.getState();
  let globalWeb3 = getGlobalWeb3(state) || window?.web3;
  if(globalWeb3)
  {
    try {

      let accountBalance = await globalWeb3.eth.getBalance(address);

      accountBalance = globalWeb3.utils.fromWei(accountBalance);

      store.dispatch(updateBalanceOfUser(accountBalance));

      return {
        success: true,
        account: address,
        balance: accountBalance
      }
    } catch (error) 
    {
      
      store.dispatch(updateBalanceOfUser(0));

      return {
        success: false,
        balance: 0,
        result: "Something went wrong: " + parseErrorMsg(error.message)
      }
    }
  }
  else {  
    return {
      success: false,
      balance: 0,
      result: "Invalid web3" 
    }
  }
}

export const compareWalllet = (first, second) => 
{
  if (!first || !second) {
    return false;
  }
  if (first.toUpperCase() === second.toUpperCase()) {
    return true;
  }
  return false;
}

const updateUserBalanceAfterTrading = async (currentAddr) =>
{
  let state = store.getState();
  let globalWeb3 = getGlobalWeb3(state) || window?.web3;
  if(globalWeb3)
  {
    let balanceOfUser = await globalWeb3?.eth?.getBalance(currentAddr);
    balanceOfUser = globalWeb3?.utils.fromWei(balanceOfUser);
    store.dispatch(updateBalanceOfUser(balanceOfUser));
  }
}

const parseErrorMsg = (errMsg) =>
{  
  var returStr  = "";
  if(isEmpty(errMsg) === false)
  {
    let startPos = JSON.stringify(errMsg).search("message");
    if(startPos >= 0)
    {
      let subStr = errMsg?.substring(startPos+4, errMsg.length)
      let endPos = subStr.indexOf("\"");
      if(endPos >= 0)
      {
        subStr = subStr?.substring(0, endPos);
        returStr = subStr;
      }
    }else returStr = errMsg;
  }
  return returStr;
}

  // export const mintMultipleNFT = async (currentAddr, count, fee) => 
  // {
  //   /*
  //    Multiple mint :  mintMultipleNFT(string[] memory tokenUris)
  //   */

  //   try 
  //   {
  //     let EvoManagerContract = await new window.web3.eth.Contract(config.EvoManagerContractAbi, config.EvoManagerContractAddress);
  //     let minting_fee = window.web3.utils.toWei(fee !== null ? fee.toString() : '0', 'ether');
      
  //     var mintMultipleNFT = EvoManagerContract.methods.mintMultipleNFT(count);
  //     let gasFee = await mintMultipleNFT.estimateGas({ from: currentAddr, value: minting_fee });
  //     var balanceOfUser = await window.web3.eth.getBalance(currentAddr);
  //     var gasPrice = 30 * (10 ** 9);
  
  //     if (balanceOfUser <= gasFee * gasPrice) {
  //       store.dispatch(setNFTTradingResult("mintMultipleNFT", false, "Insufficient balance." ));
      
  //       return {
  //         success : false,
  //         message : "Insufficient balance."
  //       }
  //     }
  //     await mintMultipleNFT.send({ from: currentAddr, value: minting_fee });
  
  //     store.dispatch(setNFTTradingResult("mintMultipleNFT", true, "Succeed in multiple minting."));
  
  //     updateUserBalanceAfterTrading(currentAddr);
  
  //     return {
  //       success : true,
  //       message : "Succeed in multiple minting."
  //     }
  //   } catch (error) {
  //     store.dispatch(setNFTTradingResult("mintMultipleNFT", false, parseErrorMsg(error.message) ));
  
  //     return {
  //       success : false,
  //       message : parseErrorMsg(error.message)
  //     }
  //   }
  // }
  
  // export const claim = async (currentAddr) => 
  // {
  //   /*
  //     claim()
  //   */
      
  //   try 
  //   {
  //     let EvoManagerContract = await new window.web3.eth.Contract(config.EvoManagerContractAbi, config.EvoManagerContractAddress);

  //     var claim = EvoManagerContract.methods.claim();
  //     let gasFee = await claim.estimateGas({ from: currentAddr });
  //     var balanceOfUser = await window.web3.eth.getBalance(currentAddr);
  //     var gasPrice = 30 * (10 ** 9);
  
  //     if (balanceOfUser <= gasFee * gasPrice) {
  //       store.dispatch(setNFTTradingResult("claim", false, "Insufficient balance." ));
      
  //       return {
  //         success : false,
  //         message : "Insufficient balance."
  //       }
  //     }
     
  //     await claim.send({ from: currentAddr });

  //     store.dispatch(setNFTTradingResult("claim", true, "Succeed in claiming."));
  
  //     updateUserBalanceAfterTrading(currentAddr);
  
  //     return {
  //       success : true,
  //       message : "Succeed in claiming."
  //     }
  //   } catch (error) {
  //     store.dispatch(setNFTTradingResult("claim", false, parseErrorMsg(error.message) ));
  
  //     return {
  //       success : false,
  //       message : parseErrorMsg(error.message)
  //     }
  //   }
  // }
  
  // export const getMintedNFTCount = async () => 
  // {
  //   /*
  //     claim()
  //   */
      
  //   try 
  //   {
  //     let EvoManagerContract = await new window.web3.eth.Contract(config.EvoManagerContractAbi, config.EvoManagerContractAddress);

  //     var count = 0;
       
  //     count = await EvoManagerContract.methods.getMintedNFTCount().call();

  //     store.dispatch(updateMintedNFTCountAfterTrading(count));
  
  //   } catch (error) {
  //     store.dispatch(updateMintedNFTCountAfterTrading(0));
  
  //   }
  // }


