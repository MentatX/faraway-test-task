import { ethers, run } from 'hardhat';
import { BaseContract } from 'ethers';

const { provider, formatEther } = ethers;

/**
 * The actual amount of gas used by this transaction.
 */
async function gasUsed(contract: BaseContract) {
  return (await contract.deploymentTransaction()?.wait(1))?.gasUsed.toLocaleString();
}

async function main() {
  const [ deployer ] = await ethers.getSigners();
  
  console.log(`\n| Deployer: ${deployer.address} (${formatEther(await provider.getBalance(deployer))})`);

  /**
   * FarawayFactory
   */ 

  const FarawayFactory = await ethers.getContractFactory("FarawayFactory");
  const factory = await FarawayFactory.deploy();

  await factory.waitForDeployment();

  console.log(`\n\u250F 'FarawayFactory' [Gas: ${await gasUsed(factory)}] \n\u2517`, await factory.getAddress());
  console.log(`  \u2517 ${await factory.collections()}`);

  // Demo
  // await (await factory.createCollection("Faraway Collection 0", "FWC")).wait();
  // await (await factory.mintToken((await factory.collections())[0], deployer, 100, "faraway.com")).wait();
  // console.log(`  \u2517 ${await factory.collections()}`);

  console.log(`\n| Deployer: ${deployer.address} (${formatEther(await provider.getBalance(deployer))})`);


  if (process.env.VERIFY_ENABLED === 'true') {
    await delay(10);
    await verify('FarawayFactory', await factory.getAddress(), []);
    await verify('Collection', (await factory.collections())[0], ["Faraway Collection 0", "FWC", await factory.getAddress(), await factory.getAddress()]);
  }
}

async function printRole(contract:any, role:string, name:string) {
  console.log(`\n| ${name}: `);
  console.log(`  ${role} `);
  console.log(`  ${await contract.getRoleAdmin(role)} <= admin`);

  let count = await contract.getRoleMemberCount(role);
  let member;
  for (var i = 0; i < count; i++) {
    member = await contract.getRoleMember(role, i);
    console.log(`  ${i}: ${member}`);
  }
}

function delay(delay: number = 1) {
  return new Promise((resolve, reject) => {
    console.log(`\n| Waiting for ${delay} sec ...`);      
    setTimeout(resolve, delay * 1000);
  });
}

async function verify(name: string, address: string, constructorArguments: any) {
  console.log(`\n| Verify '${name}'...`);
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: constructorArguments,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(`|> ${error.message}`);
    } else {
      console.log(error);
    }    
  }  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
