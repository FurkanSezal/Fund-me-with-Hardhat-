# Fund-me-With-Hardhat
It's a funding contract on blockchain with minimalistic html front-end. 
### Requirements
**git**

You'll know you've installed it right if you can run:

`git --version`

**Metamask**

This is a browser extension that lets you interact with the blockchain.

**Nodejs**

You'll know you've installed nodejs right if you can run:

`node --version`

And get an ouput like: vx.x.x

**Yarn** instead of **npm**

You'll know you've installed yarn right if you can run:

`yarn --version`

And get an output like: x.x.x

You might need to install it with npm

Confused? You can run git checkout nodejs-edition if you'd like to see this with nodejs.

### Quickstart

1.Clone the repo

`git clone https://github.com/FurkanSezal/Fund-me-with-Hardhat-`

`cd html-fund-me-fcc`

2.Run the file

You can usually just double click the file to "run it in the browser". Or you can right click the file in your VSCode and run "open with live server".


### Execute a transaction


If you want to execute a transaction follow this:

Make sure you have the following installed:

1-You'll need to open up a second terminal and run:

`git clone https://github.com/FurkanSezal/Fund-me-With-Hardhat`

`cd hardhat-fund-me-fcc`

`yarn`

`yarn hardhat node`

This will deploy a sample contract and start a local hardhat blockchain.

2-**Update your constants.js with the new contract address.**

In your constants.js file, update the variable contractAddress with the address of the deployed "FundMe" contract. You'll see it near the top of the hardhat output.

3-Connect your metamask to your local hardhat blockchain.

**PLEASE USE A METAMASK ACCOUNT THAT ISNT ASSOCIATED WITH ANY REAL MONEY**. I usually use a few different browser profiles to separate my metamasks easily.

In the output of the above command, take one of the private key accounts and import it into your metamask.

Additionally, add your localhost with chainid 31337 to your metamask.

Reserve the front end with `yarn http-server`, input an amount in the text box, and hit fund button after connecting

## Thank you! 
