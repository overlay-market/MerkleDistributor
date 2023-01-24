import BalanceTree from '../src/balance-tree'
import { BigNumber } from 'ethers'

export function tree() {
  const tree = new BalanceTree([
    { account: '0x097a3a6ce1d77a11bda1ac40c08fdf9f6202103f', amount: BigNumber.from('1000000000000000000') },
    { account: '0x097a3a6ce1d77a11bda1ac40c08fdf9f6202103f', amount: BigNumber.from('1000000000000000000') },
  ])

  return tree.getHexRoot()
}
