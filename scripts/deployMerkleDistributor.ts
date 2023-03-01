require('dotenv').config()

import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { tree } from './Tree'

async function main() {
  const root = tree()
  const endTime = 1677789942

  const TokenArb = '0x4D95e223e9C8bD4b06D50fB9A1586e1f227f9765'

  const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor')
  const merkleDistributor = await MerkleDistributor.deploy(TokenArb, root, endTime)

  await merkleDistributor.deployed()
  console.log(`merkleDistributor deployed at ${merkleDistributor.address}, merkleRoot for users: ${root}`)
}

main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  })

// npx hardhat run --network goerli scripts/deployMerkleDistributor.ts
// npx hardhat verify --network goerli 0x3C28Bb293A1f7AA17A29C570e023042346444846 Demo DM 100000000000000000000
