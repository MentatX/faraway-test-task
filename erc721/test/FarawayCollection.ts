import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

import { expect } from 'chai';
import { ethers } from 'hardhat';

import { Contract, Wallet } from 'ethers';

const { ZeroAddress, keccak256 } = ethers;

const NAME = 'FarawayCollection';
const SYMBOL = 'FRWC';

describe('FarawayCollection', () => {
    async function deployFixture() {
        let [deployer, ...otherAccounts] = await (ethers as any).getSigners();

        const GrapeCollection = await ethers.getContractFactory('FarawayCollection');
        const collection = await GrapeCollection.deploy(NAME, SYMBOL, deployer.address, deployer.address);

        return { collection };
    }

    let collection: Contract;
    beforeEach(async () => {
        ({ collection } = await loadFixture(deployFixture));
    });

    describe('has', () => {
        it('name', async function () {
            expect(await collection.name()).to.eq(NAME);
        });
    
        it('symbol', async function () {
            expect(await collection.symbol()).to.eq(SYMBOL);
        });
    });
});