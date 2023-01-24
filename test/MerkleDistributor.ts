import { ethers } from 'hardhat'
import chai, { expect } from 'chai'
import { solidity } from 'ethereum-waffle'
import BalanceTree from '../src/balance-tree'
import { BigNumber, Contract, ContractFactory } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

chai.use(solidity)

let wallet: any
let tree: BalanceTree
let OneMonth = 2630000
let distributor: Contract
let tokenContract: Contract
let wallets: SignerWithAddress[]
let TokenContract: ContractFactory
let MerkleDistributor: ContractFactory
let currentTimestamp = Math.floor(Date.now() / 1000)

describe('MerkleDistributor', () => {
  beforeEach(async function () {
    TokenContract = await ethers.getContractFactory('TestERC20')
    tokenContract = await TokenContract.deploy('DemoToken', 'DT', 0)

    MerkleDistributor = await ethers.getContractFactory('MerkleDistributor')

    wallets = await ethers.getSigners()
    wallet = wallets[1]

    tree = new BalanceTree(
      wallets.map((wallet, ix) => {
        return { account: wallet.address, amount: BigNumber.from(ix + 1) }
      })
    )

    distributor = await MerkleDistributor.deploy(tokenContract.address, tree.getHexRoot(), currentTimestamp + OneMonth)
    await tokenContract.setBalance(distributor.address, 201)
  })

  it('should fail if user already claimed', async () => {
    const proof = tree.getProof(4, wallets[4].address, BigNumber.from(5))
    await distributor.claim(4, wallets[4].address, 5, proof)
    await expect(distributor.claim(4, wallets[4].address, 5, proof)).to.be.revertedWith('AlreadyClaimed()')
  })

  it('cannot claim for address other than proof', async () => {
    const proof = tree.getProof(1, wallets[1].address, BigNumber.from(2))
    await expect(distributor.claim(1, wallets[4].address, 2, proof)).to.be.revertedWith('InvalidProof()')
  })

  it('cannot claim more than proof', async () => {
    const proof = tree.getProof(1, wallets[1].address, BigNumber.from(2))
    await expect(distributor.claim(1, wallets[1].address, 3, proof)).to.be.revertedWith('InvalidProof()')
  })

  it('transfers claimed token', async () => {
    const proof = tree.getProof(1, wallets[1].address, BigNumber.from(2))
    expect(await tokenContract.balanceOf(wallets[1].address)).to.eq(0)

    await distributor.claim(1, wallets[1].address, 2, proof)
    expect(await tokenContract.balanceOf(wallets[1].address)).to.eq(2)
  })

  it('contract must have enough to transfer', async () => {
    const proof = tree.getProof(1, wallets[1].address, BigNumber.from(2))
    await tokenContract.setBalance(distributor.address, 1)

    await expect(distributor.claim(1, wallets[1].address, 2, proof)).to.be.revertedWith(
      'ERC20: transfer amount exceeds balance'
    )
  })

  it('sets #isClaimed', async () => {
    const proof = tree.getProof(1, wallets[1].address, BigNumber.from(2))
    expect(await distributor.isClaimed(1)).to.eq(false)

    await distributor.claim(1, wallets[1].address, 2, proof)
    expect(await distributor.isClaimed(1)).to.eq(true)
  })

  it('claim index 4', async () => {
    const proof = tree.getProof(4, wallets[4].address, BigNumber.from(5))
    await expect(distributor.claim(4, wallets[4].address, 5, proof))
      .to.emit(distributor, 'Claimed')
      .withArgs(4, wallets[4].address, 5)
  })

  it('claim index 9', async () => {
    const proof = tree.getProof(9, wallets[9].address, BigNumber.from(10))
    await expect(distributor.claim(9, wallets[9].address, 10, proof))
      .to.emit(distributor, 'Claimed')
      .withArgs(9, wallets[9].address, 10)
  })

  it('claim index 19', async () => {
    const proof = tree.getProof(19, wallets[19].address, BigNumber.from(20))
    await expect(distributor.claim(19, wallets[19].address, 20, proof))
      .to.emit(distributor, 'Claimed')
      .withArgs(19, wallets[19].address, 20)
  })

  it('cannot withdraw during claim window', async () => {
    await expect(distributor.withdraw()).to.be.revertedWith('NoWithdrawDuringClaim()')
  })

  it('cannot claim after end time', async () => {
    const oneSecondAfterEndTime = currentTimestamp + OneMonth + 1
    await ethers.provider.send('evm_mine', [oneSecondAfterEndTime])

    currentTimestamp = oneSecondAfterEndTime
    const proof0 = tree.getProof(0, wallets[0].address, BigNumber.from(1))

    await expect(distributor.claim(0, wallets[0].address, 1, proof0)).to.be.revertedWith('ClaimWindowFinished()')
  })

  it('can withdraw after end time', async () => {
    const oneSecondAfterEndTime = currentTimestamp + OneMonth + 1
    await ethers.provider.send('evm_mine', [oneSecondAfterEndTime])

    currentTimestamp = oneSecondAfterEndTime
    expect(await tokenContract.balanceOf(wallets[0].address)).to.eq(0)

    await expect(distributor.withdraw()).to.emit(distributor, 'Withdraw').withArgs(wallets[0].address, 201)
    expect(await tokenContract.balanceOf(wallets[0].address)).to.eq(201)
  })

  it('only owner can withdraw even after end time', async () => {
    const oneSecondAfterEndTime = currentTimestamp + 31536001
    await ethers.provider.send('evm_mine', [oneSecondAfterEndTime])

    distributor = distributor.connect(wallet)
    await expect(distributor.withdraw()).to.be.revertedWith('Ownable: caller is not the owner')
  })
})
