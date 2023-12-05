import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

import { expect } from 'chai';
import { ethers } from 'hardhat';

import { Contract, Wallet } from 'ethers';

const { ZeroAddress, keccak256 } = ethers;

const NAME = 'FarawayCollection';
const SYMBOL = 'FRWC';

const ID = '100';
const URI = 'faraway.com';

describe('FarawayCollection', () => {
    async function deployFixture() {
        let [deployer, ...otherAccounts] = await (ethers as any).getSigners();

        const FarawayFactory = await ethers.getContractFactory('FarawayFactory');
        const factory = await FarawayFactory.deploy();

        return { factory };
    }

    let factory: Contract;
    beforeEach(async () => {
        ({ factory } = await loadFixture(deployFixture));
    });

    describe('has', () => {
        it('emty collections', async function () {
            expect((await factory.collections()).length).to.eq(0);
        });
    });

    describe('create collection', () => {
        it('first', async function () {
            await factory.createCollection("Faraway Collection 0", "FWC");

            expect((await factory.collections()).length).to.eq(1);
        });

        it('emits an CollectionCreated log', async function () {
            await expect(
                factory.createCollection(NAME, SYMBOL)
            )
            .to.emit(factory, 'CollectionCreated');
        });
    });

    describe('mint token', () => {
        beforeEach(async function () {
            await factory.createCollection(NAME, SYMBOL);
        });

        it('emits an TokenMinted log', async function () {
            let [deployer, recipient] = await (ethers as any).getSigners();

            const collection = (await factory.collections())[0];

            await expect(
                factory.mintToken(collection, recipient.address, ID, URI)
            )
            .to.emit(factory, 'TokenMinted')
            .withArgs(collection, recipient.address, ID, URI);
        });
    });
});