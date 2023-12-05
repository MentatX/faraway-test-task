import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-watcher";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      // blockGasLimit: 8000000,
      gasPrice: 20000000000,    // 20 Gwei
      // loggingEnabled: true,
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      gasPrice: 4000000000,    // 4 Gwei

      url: process.env.PROVIDER_URI || "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY !== undefined ? [process.env.DEPLOYER_PRIVATE_KEY] : [],

    },
    goerli: {
      gasPrice: 10000000000,    // 10 Gwei

      url: process.env.PROVIDER_URI || "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY !== undefined ? [process.env.DEPLOYER_PRIVATE_KEY] : [],

    },
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
    // coinmarketcap: process.env.REPORT_COINMARKETCAP,
    // currency: process.env.REPORT_CURRENCY,
    // token: process.env.REPORT_TOKEN,
    // gasPriceApi: process.env.REPORT_GAS_PRICE_API,
    // gasPrice: 25,
  },
  etherscan: {
    apiKey: {
      mainnet: <string>process.env.ETHERSCAN_API_KEY,
      sepolia: <string>process.env.ETHERSCAN_API_KEY,
    }
  }
}

export default config;