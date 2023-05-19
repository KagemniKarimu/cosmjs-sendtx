const { SigningStargateClient, coins, GasPrice } = require('@cosmjs/stargate');
const { DirectSecp256k1Wallet } = require('@cosmjs/proto-signing');
const { toBech32 } = require('@cosmjs/encoding');
const { rawSecp256k1PubkeyToRawAddress } = require("@cosmjs/amino");

require('dotenv').config()

//RPC info
const rpcEndpoint = "https://g.w.lavanet.xyz:443/gateway/cos5t/rpc-http/a43dd98c9ea68afa4f167969f48770bb";

//Sender & Receiver info
const receiver = "cosmos1qxpu7dc0vz2cha0rucdezevejvcwltw4ytqyd2";
const senderPrivateKey = process.env.PRIVATE_KEY;

//Tx info
const amount = coins('100000', "uatom");
const gasPrice = GasPrice.fromString("0.025uatom");
const txOptions = {
    gasPrice
  };


//Tx function
(async () => {
	
	//Acquire our Sender, Connect our Client, & Get our Chain ID
	const sender = await DirectSecp256k1Wallet.fromKey(Buffer.from(senderPrivateKey,'hex'));
    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, sender, txOptions);
	const chainID = await client.getChainId();

	//Print Basic Tx Info to Console as a Sanity Check
	console.log("Connected Chain_ID: ", chainID);
	console.log("From Sender: ", toBech32("cosmos",rawSecp256k1PubkeyToRawAddress(sender.pubkey)));
	console.log("To Receiver: ", receiver);
	console.log("Tx Amount ", amount);

	//Grab Account Information of Sender from Chain - should match From Sender:
	const [senderAccount] = await sender.getAccounts();

	// Send Tokens with Auto Gas Fees and Memo Text
	const result = await client.sendTokens(senderAccount.address, receiver, amount,"auto","sending a signedTx with Cosmjs");
  console.log('Transaction result:', result);
})();