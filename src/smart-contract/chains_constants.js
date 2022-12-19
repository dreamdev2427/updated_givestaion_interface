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
export const MUMBAI_CHAIN_ID = "0x13881";
export const MUMBAI_NETWORK_ID = "80001";
export const GOERLI_CHAIN_ID = "0x1a4";
export const GOERLI_NETWORK_ID = "420";
export const TEST_ARBITRUM_CHAIN_ID = "0x66eed";
export const TEST_ARBITRUM_NETWORK_ID = "421613";

export const DEFAULT_CHAIN_ID = RINKEBY_CHAIN_ID;

export const chains = {
    [BSC_CHAIN_ID]: {
        rpcUrl: "https://bsc-dataseed1.binance.org/",
        nativeCurrency: "BNB",
        factoryAddress: "0x3Fa06e4703B9c053AF142328f8654Cb117FE7FD9",
        givePointAddress: "0xDD3A45a81eb884cd2EE773DE4921F76E8b5B712c",
        blockScanUrl: "https://bscscan.com/"
    },
    [BSC_NETWORK_ID]: {
        rpcUrl: "https://bsc-dataseed1.binance.org/",
        nativeCurrency: "BNB",
        factoryAddress: "0x3Fa06e4703B9c053AF142328f8654Cb117FE7FD9",
        givePointAddress: "0xDD3A45a81eb884cd2EE773DE4921F76E8b5B712c",
        blockScanUrl: "https://bscscan.com/"
    },
    [POLYGON_CHAIN_ID]: {
        rpcUrl: "https://rinkeby.infura.io/v3/08ac79d88b5d4aea961ca36af7ea6ee7",
        nativeCurrency: "MATIC",
        factoryAddress: "0x9d4EB3F30854cA4B46554313611F110E57104e9C",
        givePointAddress: "0x7F449ED088D620D77f66d4a17DFc3117B000BBf7",
        blockScanUrl: "https://polygonscan.com/"
    },
    [POLYGON_NETWORK_ID]: {
        rpcUrl: "https://rinkeby.infura.io/v3/08ac79d88b5d4aea961ca36af7ea6ee7",
        nativeCurrency: "MATIC",
        factoryAddress: "0x9d4EB3F30854cA4B46554313611F110E57104e9C",
        givePointAddress: "0x7F449ED088D620D77f66d4a17DFc3117B000BBf7",
        blockScanUrl: "https://polygonscan.com/"
    },
    [OPTIMISTIC_CHAIN_ID]: {
        rpcUrl: "https://mainnet.optimism.io/",
        nativeCurrency: "oETH",
        factoryAddress: "0xCA091f771124dF584620af06C43ddF49e0BB502D",
        givePointAddress: "0x18a12dfeAB833b7D391D22bCb6002f1CD25B838B",
        blockScanUrl: "https://optimistic.etherscan.io/"
    },
    [OPTIMISTIC_NETWORK_ID]: {
        rpcUrl: "https://mainnet.optimism.io/",
        nativeCurrency: "oETH",
        factoryAddress: "0xCA091f771124dF584620af06C43ddF49e0BB502D",
        givePointAddress: "0x18a12dfeAB833b7D391D22bCb6002f1CD25B838B",
        blockScanUrl: "https://optimistic.etherscan.io/"
    },
    [GNOSIS_CHAIN_ID]: {
        rpcUrl: "https://gnosis-mainnet.public.blastapi.io",
        nativeCurrency: "xDAI",
        factoryAddress: "0x3D2d157070A4F7254E64f90d9A7ceb0e633BCf12",
        givePointAddress: "0x74F6D3E611C1D87754eF6c9F7AefE6d92a21B2f7",
        blockScanUrl: "https://blockscout.com/xdai/mainnet/ "
    },
    [GNOSIS_NETWORK_ID]: {
        rpcUrl: "https://gnosis-mainnet.public.blastapi.io",
        nativeCurrency: "xDAI",
        factoryAddress: "0x3D2d157070A4F7254E64f90d9A7ceb0e633BCf12",
        givePointAddress: "0x74F6D3E611C1D87754eF6c9F7AefE6d92a21B2f7",
        blockScanUrl: "https://blockscout.com/xdai/mainnet/ "
    },
    [ARBITRUM_CHAIN_ID]: {
        rpcUrl: "https://nova.arbitrum.io/rpc",
        nativeCurrency: "aETH",
        factoryAddress: "0x4b5626425A62458aa1A5256c75bF678B5e90C2bA",
        givePointAddress: "0x7DD7d0e4985363051e993C3EABAf6493A7691F50",
        blockScanUrl: "https://nova-explorer.arbitrum.io"
    },
    [ARBITRUM_NETWORK_ID]: {
        rpcUrl: "https://nova.arbitrum.io/rpc",
        nativeCurrency: "aETH",
        factoryAddress: "0x4b5626425A62458aa1A5256c75bF678B5e90C2bA",
        givePointAddress: "0x7DD7d0e4985363051e993C3EABAf6493A7691F50",
        blockScanUrl: "https://nova-explorer.arbitrum.io"
    },
    [BSC_TEST_CHAIN_ID]: {
        rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        nativeCurrency: "tBNB",
        factoryAddress: "0x690f275c8e0a57007305a36d353d50ccf0da12b3",
        givePointAddress: "0x7e504Ca40c55E15F9Ee76a850caCfA6FD63b6254",
        blockScanUrl: "https://testnet.bscscan.com/"
    },
    [BSC_TEST_NETWORK_ID]: {
        rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        nativeCurrency: "tBNB",
        factoryAddress: "0x690f275c8e0a57007305a36d353d50ccf0da12b3",
        givePointAddress: "0x7e504Ca40c55E15F9Ee76a850caCfA6FD63b6254",
        blockScanUrl: "https://testnet.bscscan.com/"
    },
    [MUMBAI_CHAIN_ID]: {
        rpcUrl: "https://matic-mumbai.chainstacklabs.com",
        nativeCurrency: "mMATIC",
        factoryAddress: "0x3D2d157070A4F7254E64f90d9A7ceb0e633BCf12",
        givePointAddress: "0x74F6D3E611C1D87754eF6c9F7AefE6d92a21B2f7",
        blockScanUrl: "https://mumbai.polygonscan.com/"
    },
    [MUMBAI_NETWORK_ID]: {
        rpcUrl: "https://matic-mumbai.chainstacklabs.com",
        nativeCurrency: "mMATIC",
        factoryAddress: "0x3D2d157070A4F7254E64f90d9A7ceb0e633BCf12",
        givePointAddress: "0x74F6D3E611C1D87754eF6c9F7AefE6d92a21B2f7",
        blockScanUrl: "https://mumbai.polygonscan.com/"
    },
    [GOERLI_CHAIN_ID]: {
        rpcUrl: "https://goerli.optimism.io/",
        nativeCurrency: "GoerliETH",
        factoryAddress: "0x4b5626425A62458aa1A5256c75bF678B5e90C2bA",
        givePointAddress: "0x7DD7d0e4985363051e993C3EABAf6493A7691F50",
        blockScanUrl: "https://goerli.etherscan.io/"
    },
    [GOERLI_NETWORK_ID]: {
        rpcUrl: "https://goerli.optimism.io/",
        nativeCurrency: "GoerliETH",
        factoryAddress: "0x4b5626425A62458aa1A5256c75bF678B5e90C2bA",
        givePointAddress: "0x7DD7d0e4985363051e993C3EABAf6493A7691F50",
        blockScanUrl: "https://goerli.etherscan.io/"
    },
    [TEST_ARBITRUM_CHAIN_ID]: {
        rpcUrl: "https://goerli-rollup.arbitrum.io/rpc",
        nativeCurrency: "aETH",
        factoryAddress: "0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        givePointAddress: "0xb2c5544a5B60757e3A7885A85b42Bc4160609992",
        blockScanUrl: "https://testnet.arbiscan.io/"
    },
    [TEST_ARBITRUM_NETWORK_ID]: {
        rpcUrl: "https://goerli-rollup.arbitrum.io/rpc",
        nativeCurrency: "aETH",
        factoryAddress: "0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        givePointAddress: "0xb2c5544a5B60757e3A7885A85b42Bc4160609992",
        blockScanUrl: "https://testnet.arbiscan.io/"
    },
}
