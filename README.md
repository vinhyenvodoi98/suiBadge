# Project

![cover](https://github.com/vinhyenvodoi98/Liquidity-garden/blob/main/images/cover.png)

Wellcome to Liquidity Garden

## Introduction
"Liquidity-garden" is a game that falls under the farm simulation genre. In this game, players are tasked with building and managing their own farm garden. The main elements of the game include:

1. Building and Managing the Farm: Players have to **stake liquidity** from **FlowX Dex** to by NFT seed, then the player must water it every day. Because the tree is a dynamic NFT, it will change shape if watered enough. The tree will release $OXYGEN tokens every day and depending on its lifespan, the amount of $OXYGEN will be different.

2. Raise pets: Currently we have 2 types of Pet
- Fud the pug pets: We will convert the amount of $FUD tokens that users own to different pets.Game also integrates **swap** $FUD tokens from $SUI for users right in the game using **flowx's sdk**
- SuiFrens: Those who own Suifrens NFT will also receive pets

When you have digital pets, they will help you take care the garden, so the number of $OXYGEN tokens will increase

## How we build project

Smartcontract: Build by Move language

Frontend: Build with Nextjs, ts, tailwind

RPC + Indexer : [Blockeden.xyz](https://blockeden.xyz/docs/sui/sui-overflow/)

Swap, get liquidity balance: [FlowX sdk](https://www.npmjs.com/package/@flowx-pkg/ts-sdk?activeTab=readme)

Interact :
  - [Fud the Pug](https://fudthepug.com/): Distribute pets based on the amount of FUD owned
  - [SuiFriend](https://suifrens.com/) : Show Capy as pets

## What we do during hackathon

- We have built a smart contract and frontend that can interact with each other and deployed on mainnet
- Integrates swap feature from flowX
- Use indexer from blockeden to query data
- Creating a new use for the FUD token
- SuiFriend's NFT integration
- Stake FlowX liquidity token and mint Dynamic NFT Seed
- Player water plants every day and receive **closed-loop token: $Oxygen**

## What's problem

- First time using Move to write smart contract
- First time learning about Sui and its components

## Plan for future

- UI/UX improvements
- Develop tokenomics for $OXYGEN token
- Create interaction between users' gardens
- Can stake liquidity of many DEX
- Build community
- Multi chains supported

## How to run project

### Frontend
Install package
```bash
npm install
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
