// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const { ethers } = require("hardhat");
const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Kontrakt = await ethers.getContractFactory("Kontrakt");
  const kontrakt = await Kontrakt.deploy();
  await kontrakt.deployed();

  const Token_test = await ethers.getContractFactory("Token_test");
  const token = await Token_test.deploy(kontrakt.address, Number(10000000));
  await token.deployed();

  console.log("All contracts depolyed");
  console.log("Token address: ", token.address);

  await kontrakt.addUser('0x10405B8c49823F1f67307BC92589863a20CB8Eb5', 'Ronald', 'Frangulyan', '240355@edu.p.lodz.pl', 2, {gasLimit: 540000});

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token, kontrakt);
}

function saveFrontendFiles(token, kontrakt) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "token-address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "kontrakt-address.json"),
    JSON.stringify({ Kontrakt: kontrakt.address }, undefined, 2)
  );

  const Token_testArtifact = artifacts.readArtifactSync("Token_test");
  const KontraktArtifact = artifacts.readArtifactSync("Kontrakt");

  fs.writeFileSync(
    path.join(contractsDir, "Token_test.json"),
    JSON.stringify(Token_testArtifact, null, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "Kontrakt.json"),
    JSON.stringify(KontraktArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
