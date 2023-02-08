require('dotenv').config()

import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { tree } from './Tree'

async function main() {
  const root = tree()
  const endTime = 86400 + 1675832764
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
// npx hardhat verify --network arbitrum_testnet 0x2b6b1a731971B7e6928C9679f3d5c92311FDBF4C 0x58954C03A9d70C54be5E63478A565CD099D0939c 0xc9df9917d1d4679e45b83c3193fee4c76785e2472a65f8991679880bfed045db 1675919164
