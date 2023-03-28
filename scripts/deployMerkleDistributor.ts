require('dotenv').config()

import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { tree } from './Tree'

async function main() {
  const root = tree()
  const endTime = 1681308420

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
// npx hardhat verify --network arbitrum_mainnet 0x769dECe63871B82c127Bd845afA1f149921AFf71 0x4305C4Bc521B052F17d389c2Fe9d37caBeB70d54 0xd964a9dfa1b840fc4b9dada4fe622e28eef04e7e9df754a5b6cbefd1ded53763 1681308420
