require('dotenv').config()

import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { tree } from './Tree'

async function main() {
  const root = tree()
  const endTime = 86400 + 1677213539

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
// npx hardhat verify --network goerli 0x3C28Bb293A1f7AA17A29C570e023042346444846 Demo DM 100000000000000000000
