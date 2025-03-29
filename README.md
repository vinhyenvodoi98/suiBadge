# sui-badge

sui-badge is a platform for creating badge NFTs on the Sui blockchain. This project was inspired by the numerous Hacker House events organized by Sui worldwide. I believe that every developer wants a badge as proof of their participation. Additionally, sui-badge introduces an optional location verification feature, ensuring that developers have physically attended the Hacker House instead of just joining online.

## Features
- Issue badge NFTs to developers who participate in Sui Hacker House events.
- Optional location verification to confirm in-person attendance.
- Create nft according to a user whitelist
- Decentralized and secure with smart contracts deployed on Sui Devnet.
- Off-chain data storage using MongoDB.


## Tech Stack
- **Frontend:** Next.js, Tailwind CSS
- **Smart Contracts:** Sui, deployed on Devnet
- **Database:** MongoDB (for off-chain storage)

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- Sui CLI & Wallet

### Setup
```sh
# Clone the repository
git clone https://github.com/yourusername/sui-badge.git
cd sui-badge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB and Sui configuration

# Start the development server
npm run dev
```

## Smart Contract Deployment
```sh
# Login to Sui Devnet
sui client switch --env devnet

# Deploy smart contract
sui move build
sui client publish --gas-budget 100000000
```

## License
This project is licensed under the MIT License.
