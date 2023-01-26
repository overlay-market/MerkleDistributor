import BalanceTree from '../src/balance-tree'
import { userInfo } from './userInfo'
import fs from 'fs'

const treeInfo: any = []

export function tree() {
  const tree = new BalanceTree(userInfo)

  userInfo.map(({ account, amount }, index) => {
    const data = {
      address: account,
      proof: tree.getProof(index, account, amount),
      amount: Number(amount),
      index: index,
    }

    treeInfo.push(data)
  })

  fs.writeFile('data.txt', JSON.stringify(treeInfo), (err) => {
    if (err) throw err
  })

  return tree.getHexRoot()
}
