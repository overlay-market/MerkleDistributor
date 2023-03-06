require('dotenv').config()

import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { tree } from './Tree'

async function main() {
  const root = tree()
  const endTime = 1680802200

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
// npx hardhat verify --network arbitrum_mainnet 0x5a0B95E113B6713eD3dE69E47af4a946F9538b8a 0x4305C4Bc521B052F17d389c2Fe9d37caBeB70d54 0xfeed7ee59645916680aff6cfa31d3154bf4529f0c3b2253d48e65315d96d58a5 1680629400
