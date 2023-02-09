require('dotenv').config()

import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { tree } from './Tree'

async function main() {
  const root = tree()
  const endTime = 259200 + 1675968203
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
// npx hardhat verify --network arbitrum_testnet 0xAEA8CA6e3854E39373C67879aE654bC117c9931D 0x58954C03A9d70C54be5E63478A565CD099D0939c 0x3ca98dafae8689605187cf323b5322f2f6fab6cbceaafe32c8483adc31fb3e05 1676227403
