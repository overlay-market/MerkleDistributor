import BalanceTree from '../src/balance-tree'
import { userInfo } from './userInfo'
import { ethers } from 'ethers'
import fs from 'fs'

const treeInfo: any = {}

export function tree() {
  const tree = new BalanceTree(userInfo)

  userInfo.map(({ account, amount }, index) => {
    const userAddress = ethers.utils.getAddress(account)

    treeInfo[`${userAddress}`] = {
      address: userAddress,
      proof: tree.getProof(index, account, amount),
      amount: amount.toString(),
      index: index,
    }
  })

  fs.writeFile('src/treeInfo.json', JSON.stringify(treeInfo), (err) => {
    if (err) throw err
  })

  return tree.getHexRoot()
}
tree()
