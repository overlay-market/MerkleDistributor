require('dotenv').config()

import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { tree } from './Tree'

async function main() {
  const root = tree()
  const endTime = 86400 + 1677035212

  const Token = await ethers.getContractFactory('TestERC20')
  const token = await Token.deploy('Demo', 'DM', '100000000000000000000')

  const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor')
  const merkleDistributor = await MerkleDistributor.deploy(token.address, root, endTime)

  await merkleDistributor.deployed()
  console.log(
    `merkleDistributor deployed at ${merkleDistributor.address}, merkleRoot for users: ${root}, address: ${token.address}`
  )
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
// npx hardhat verify --network goerli 0x1bD02A82707a48ae07DbbBe8C79428cf05d47479 0x58954C03A9d70C54be5E63478A565CD099D0939c 0x6e08f28b300f22f2b99cf356deb56f14c37f110f14ac6d19ff278c12fb656b28 1677121612
