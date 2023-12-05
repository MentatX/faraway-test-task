# Overview

---

`ERC721` collection smart contract for the **FaraWay**.

### Compile

```bash
$ npm run compile
```

### Deploy

Quick start:

```bash
$ npm run deploy
```

### Tests

```bash
$ npm test
```

### Contracts
---


#### FarawayCollection
---

[ERC721](https://docs.openzeppelin.com/contracts/4.x/erc721) collection.

**Roles:**

- `MINTER_ROLE`
- `DEFAULT_ADMIN_ROLE`

**Features:**

- `ERC721URIStorage`


#### FarawayFactory
---

Entry point to create collections & mint tokens.

**Roles:**

- `MINTER_ROLE`
- `DEFAULT_ADMIN_ROLE`


### Deployment summary

```bash
# Network: Ethereum Sepolia
# Env: development

$ npm run deploy:sepolia

> grape-erc1155@1.0.0 deploy:sepolia
> . ./.env.sepolia && npx hardhat run scripts/deploy.ts --network sepolia

┏ 'FarawayFactory' [Gas: 2,135,397] 
┗ 0x1907C22711488bCcdaA3583D853Bc87A583cf845
  ┗ empty

| Waiting for 10 sec ...

| Verify 'FarawayFactory'...

Successfully verified contract GrapeCollection on Etherscan.
https://sepolia.etherscan.io/address/0x1907C22711488bCcdaA3583D853Bc87A583cf845#code
```