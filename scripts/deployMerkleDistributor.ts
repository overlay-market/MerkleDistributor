require('dotenv').config()

import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { tree } from './Tree'

async function main() {
  const root = tree()
  const endTime = 1680579343

  const TokenArb = '0xdBD4a09ac1962F028390C53F4a4d126F5E13baEe'
  const OvlFoundationAdddress = '0x5ce44FF0C50f6a28f75932b8b12c5cbE9dEc343E'

  const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor')
  const merkleDistributor = await MerkleDistributor.deploy(TokenArb, root, endTime)

  await merkleDistributor.deployed()
  await merkleDistributor.transferOwnership(OvlFoundationAdddress)
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

// npx hardhat run --network arbitrum_mainnet scripts/deployMerkleDistributor.ts
// npx hardhat verify --network arbitrum_mainnet 0x455e3C831471Ab7f8B2122Dc5164f5bB871111FE 0x1e77c4764db2c9f887E8A9122f2eE400C42530aA 0xbf4b054d1efc570b375b3ed62082fcd9c10986e2185f1319865243c2fe13d831 1677864600
