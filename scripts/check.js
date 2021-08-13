const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const abiDecoder = require('abi-decoder')

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;

if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
  );
  return;
}

const NFT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "message",
        type: "string",
      },
    ],
    name: "mintTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  const network =
    NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";
  const provider = new HDWalletProvider(
    MNEMONIC,
    isInfura
      ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
      : "https://eth-" + network + ".alchemyapi.io/v2/" + NODE_API_KEY
  );
  const web3Instance = new web3(provider);

  const tx = await new web3Instance.eth.getTransaction('0x94be9437900088730c017fede7d7c1273d04eef3f753f148e925d966d9a68ba4');
  const { input } = tx;
  abiDecoder.addABI(NFT_ABI);
  const decoded = abiDecoder.decodeMethod(input);
  const message = decoded.params.filter((param) => param.name === 'message')[0].value;
  console.log(`message from tx input: ${message}`);
}

main();
