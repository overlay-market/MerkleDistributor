require('dotenv').config()

import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { tree } from './Tree'

async function main() {
  const root = tree()
  const endTime = 1677951000

  const TokenArb = '0x4305C4Bc521B052F17d389c2Fe9d37caBeB70d54'
  const OvlFoundationAdddress = '0xBC443021E85837Ee92dAf1378a2209A2c23a0062'

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
