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

  const Token_test = await ethers.getContractFactory("Token_test");
  const token = await Token_test.deploy(Number(10000000));
  await token.deployed();

  const Workers = await ethers.getContractFactory("AccountTypes");
  const workers = await Workers.deploy();
  await workers.deployed();
  
  const Notification = await ethers.getContractFactory("Notifications");
  const notification = await Notification.deploy();
  await notification.deployed();

  const Marketplace = await ethers.getContractFactory("marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();

  const Kontrakt = await ethers.getContractFactory("Main");
  const kontrakt = await Kontrakt.deploy();
  await kontrakt.deployed();

  console.log("All contracts depolyed");
  console.log("Token address: ", token.address)

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token, workers, notification, marketplace, kontrakt);
}

function saveFrontendFiles(token, workers, notification, marketplace, kontrakt) {
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
    path.join(contractsDir, "notification-address.json"),
    JSON.stringify({ Notification: notification.address }, undefined, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "workers-address.json"),
    JSON.stringify({ Workers: workers.address }, undefined, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "marketplace-address.json"),
    JSON.stringify({ Marketplace: marketplace.address }, undefined, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "kontrakt-address.json"),
    JSON.stringify({ Kontrakt: kontrakt.address }, undefined, 2)
  );

  const Token_testArtifact = artifacts.readArtifactSync("Token_test");
  const NotificationArtifact = artifacts.readArtifactSync("Notifications");
  const WorkersArtifact = artifacts.readArtifactSync("AccountTypes");
  const MarketplaceArtifact = artifacts.readArtifactSync("marketplace");
  const KontraktArtifact = artifacts.readArtifactSync("Main");

  fs.writeFileSync(
    path.join(contractsDir, "Token_test.json"),
    JSON.stringify(Token_testArtifact, null, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "Notifications.json"),
    JSON.stringify(NotificationArtifact, null, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "AccountTypes.json"),
    JSON.stringify(WorkersArtifact, null, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "marketplace.json"),
    JSON.stringify(MarketplaceArtifact, null, 2)
  );
  fs.writeFileSync(
    path.join(contractsDir, "Main.json"),
    JSON.stringify(KontraktArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
