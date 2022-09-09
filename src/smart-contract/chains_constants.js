export const BSC_CHAIN_ID = "0x38";
export const BSC_NETWORK_ID = "56";
export const POLYGON_CHAIN_ID = "0x89";
export const POLYGON_NETWORK_ID = "137";
export const BSC_TEST_CHAIN_ID = "0x61";
export const BSC_TEST_NETWORK_ID = "97";
export const RINKEBY_CHAIN_ID = "0x4";
export const RINKEBY_NETWORK_ID = "4";
export const GNOSIS_CHAIN_ID = "0x64";
export const GNOSIS_NETWORK_ID = "100";
export const OPTIMISTIC_CHAIN_ID = "0xa";
export const OPTIMISTIC_NETWORK_ID = "10";
export const ARBITRUM_NETWORK_ID = "42161";
export const ARBITRUM_CHAIN_ID = "0xa4b1";

export const DEFAULT_CHAIN_ID = RINKEBY_CHAIN_ID;

export const chains = {
    [BSC_CHAIN_ID]:{
        rpcUrl:"https://bsc-dataseed1.binance.org/",
        nativeCurrency:"BNB",
        factoryAddress:"0x3Fa06e4703B9c053AF142328f8654Cb117FE7FD9",
        givePointAddress:"0xDD3A45a81eb884cd2EE773DE4921F76E8b5B712c",
        blockScanUrl:"https://bscscan.com/"
    },
    [BSC_NETWORK_ID]:{
        rpcUrl:"https://bsc-dataseed1.binance.org/",
        nativeCurrency:"BNB",
        factoryAddress:"0x3Fa06e4703B9c053AF142328f8654Cb117FE7FD9",
        givePointAddress:"0xDD3A45a81eb884cd2EE773DE4921F76E8b5B712c",
        blockScanUrl:"https://bscscan.com/"
    },
    [POLYGON_CHAIN_ID]:{
        rpcUrl:"https://rinkeby.infura.io/v3/08ac79d88b5d4aea961ca36af7ea6ee7",
        nativeCurrency:"MATIC",
        factoryAddress:"0x9d4EB3F30854cA4B46554313611F110E57104e9C",
        givePointAddress:"0x7F449ED088D620D77f66d4a17DFc3117B000BBf7",
        blockScanUrl:"https://polygonscan.com/"
    },
    [POLYGON_NETWORK_ID]:{
        rpcUrl:"https://rinkeby.infura.io/v3/08ac79d88b5d4aea961ca36af7ea6ee7",
        nativeCurrency:"MATIC",
        factoryAddress:"0x9d4EB3F30854cA4B46554313611F110E57104e9C",
        givePointAddress:"0x7F449ED088D620D77f66d4a17DFc3117B000BBf7",
        blockScanUrl:"https://polygonscan.com/"
    },
    [OPTIMISTIC_CHAIN_ID]:{
        rpcUrl:"https://mainnet.optimism.io/",
        nativeCurrency:"ETH",
        factoryAddress:"0x02313d5c2Aeb3B0bdF5C6725a2a1b0400BfCD83b",
        givePointAddress:"0x06241DC412EfDfc4cBfe773fDAd4bBfFb32D6f37",
        blockScanUrl:"https://optimistic.etherscan.io/"
    },
    [OPTIMISTIC_NETWORK_ID]:{
        rpcUrl:"https://mainnet.optimism.io/",
        nativeCurrency:"ETH",
        factoryAddress:"0x02313d5c2Aeb3B0bdF5C6725a2a1b0400BfCD83b",
        givePointAddress:"0x06241DC412EfDfc4cBfe773fDAd4bBfFb32D6f37",
        blockScanUrl:"https://optimistic.etherscan.io/"
    },
    [GNOSIS_CHAIN_ID]:{
        rpcUrl:"https://rpc.gnosischain.com/",
        nativeCurrency:"xDai",
        factoryAddress:"",
        givePointAddress:"",
        blockScanUrl:"https://blockscout.com/xdai/mainnet/"
    },
    [GNOSIS_NETWORK_ID]:{
        rpcUrl:"https://rpc.gnosischain.com/",
        nativeCurrency:"xDai",
        factoryAddress:"",
        givePointAddress:"",
        blockScanUrl:"https://blockscout.com/xdai/mainnet/"
    },
    [ARBITRUM_CHAIN_ID]:{
        rpcUrl:"https://arb1.arbitrum.io/rpc",
        nativeCurrency:"ETH",
        factoryAddress:"0x9d4EB3F30854cA4B46554313611F110E57104e9C",
        givePointAddress:"0x7F449ED088D620D77f66d4a17DFc3117B000BBf7",
        blockScanUrl:"https://arbiscan.io/"
    },
    [ARBITRUM_NETWORK_ID]:{
        rpcUrl:"https://arb1.arbitrum.io/rpc",
        nativeCurrency:"ETH",
        factoryAddress:"0x9d4EB3F30854cA4B46554313611F110E57104e9C",
        givePointAddress:"0x7F449ED088D620D77f66d4a17DFc3117B000BBf7",
        blockScanUrl:"https://arbiscan.io/"
    },
    [BSC_TEST_CHAIN_ID]:{
        rpcUrl:"https://data-seed-prebsc-1-s1.binance.org:8545/",
        nativeCurrency:"tBNB",
        factoryAddress:"0x39fD8c1DD05e8DB92245a8d9e91283728113CB04",
        givePointAddress:"0x681Fe7444B998964a134B9223013EBdC10f70280",
        blockScanUrl:"https://testnet.bscscan.com/"
    },
    [BSC_TEST_NETWORK_ID]:{
        rpcUrl:"https://data-seed-prebsc-1-s1.binance.org:8545/",
        nativeCurrency:"tBNB",
        factoryAddress:"0x39fD8c1DD05e8DB92245a8d9e91283728113CB04",
        givePointAddress:"0x681Fe7444B998964a134B9223013EBdC10f70280",
        blockScanUrl:"https://testnet.bscscan.com/"
    },
    [RINKEBY_CHAIN_ID]:{
        rpcUrl:"https://rinkeby.infura.io/v3/08ac79d88b5d4aea961ca36af7ea6ee7",
        nativeCurrency:"ETH",
        factoryAddress:"",
        givePointAddress:"",
        blockScanUrl:"https://rinkeby.etherscan.io/"
    },
    [RINKEBY_NETWORK_ID]:{
        rpcUrl:"https://rinkeby.infura.io/v3/08ac79d88b5d4aea961ca36af7ea6ee7",
        nativeCurrency:"ETH",
        factoryAddress:"",
        givePointAddress:"",
        blockScanUrl:"https://rinkeby.etherscan.io/"
    }
}
