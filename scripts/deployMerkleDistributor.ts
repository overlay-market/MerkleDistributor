require('dotenv').config()

import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { tree } from './Tree'

async function main() {
  const root = tree()
  const endTime = 1200 + 1674744477
  const token = '0x58954C03A9d70C54be5E63478A565CD099D0939c'

  const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor')
  const merkleDistributor = await MerkleDistributor.deploy(token, root, endTime)

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

// npx hardhat run --network arbitrum_testnet scripts/deployMerkleDistributor.ts
// npx hardhat verify --network arbitrum_testnet 0xAC408E75db74107B1A1113B90A27DB9aa61d481D 0x58954C03A9d70C54be5E63478A565CD099D0939c 0x7686edd11bc8462ba2301284acaccbea5a07961d042c55801c365da9d70a5fdf 1674737879
