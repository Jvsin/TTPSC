const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Main contract" , function()  {
  async function deployTokenFixture() {
    // deploy kontraktu
    const Kontrakt = await ethers.getContractFactory("Kontrakt");
    const kontrakt = await Kontrakt.deploy();
    await kontrakt.deployed();
    // dodanie pustych kont
    const [addr1, addr2, owner] = await ethers.getSigners();
    return { kontrakt, addr1, addr2, owner};
  }
  
  async function deployTokenAndContract() {
    
    const Kontrakt = await ethers.getContractFactory("Kontrakt");
    const kontrakt = await Kontrakt.deploy();
    await kontrakt.deployed();

    const Token = await ethers.getContractFactory("Token_test");
    const token = await Token.deploy(kontrakt.address, Number(1));
    await token.deployed();

    const [owner ,addr1, addr2 ] = await ethers.getSigners();
    return { token, kontrakt, owner, addr1, addr2 };
  }

  it("Deploy contract and token and check values", async function(){
    const { token , kontrakt } = await loadFixture(deployTokenAndContract);
    expect(await token.symbol()).to.equal("$TTPSC");
    expect(await token.name()).to.equal("TTPSC Money");
    expect(await token.decimals()).to.equal(Number(18));
    expect(await token.totalSupply()).to.equal(BigInt(1000000000000000000));
    expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(1000000000000000000));
  });

  describe("Marketplace" , function() {

    it("GetAllItems => error => empty stak", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture);
      await expect(kontrakt.GetAllItems()).to.be.rejectedWith("Empty stack");
    });

    it("AddItem => error => add item with empty name", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture);
      await expect( kontrakt.AddItem("", Number(10))).to.be.rejectedWith("Name cannot be empty");
    });

    it("AddItem && GetAllItems => add first item to the store", async function() {
      const { kontrakt } = await loadFixture(deployTokenFixture);  
      await kontrakt.AddItem("Item 1", Number(1));
      const items = await kontrakt.GetAllItems();
      expect(items.length).to.equal(1);
      expect(items[0].name).to.equal("Item 1");
      expect(items[0].price).to.equal(1);
      expect(items[0].status).to.equal(0);
    });

    it("AddItem && GetAllItems => add second item to the store", async function() {
      const { kontrakt } = await loadFixture(deployTokenFixture);  
      await kontrakt.AddItem("Item 1", Number(1));
      await kontrakt.AddItem("Item 2", Number(10));
      const items = await kontrakt.GetAllItems();
      expect(items.length).to.equal(2);
      expect(items[1].name).to.equal("Item 2");
      expect(items[1].price).to.equal(10);
      expect(items[1].status).to.equal(0);
    });
    
    it("ArchiveItem => error => Empty stack", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture);  
      await expect(kontrakt.ArchiveItem(Number(0))).to.be.rejectedWith("Empty stack");
    });

    it("ArchiveItem => error => Product out of the list", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture);  
      await kontrakt.AddItem("Item 1", Number(1));
      await expect(kontrakt.ArchiveItem(Number(12))).to.be.rejectedWith("Product out of the list");
    });

    it("ArchiveItem => archive 1 item", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture); 
      await kontrakt.AddItem("Item 1", Number(1));
      const items = await kontrakt.GetAllItems();
      expect(items.length).to.equal(1);
      expect(items[0].name).to.equal("Item 1");
      expect(items[0].price).to.equal(1);
      expect(items[0].status).to.equal(0);
      await kontrakt.ArchiveItem(Number(0));
      const items2 = await kontrakt.GetAllItems();
      expect(items2.length).to.equal(1);
      expect(items2[0].name).to.equal("Item 1");
      expect(items2[0].price).to.equal(1);
      expect(items2[0].status).to.equal(1);
    });

    it("ArchiveItem => error => Item is already archived", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture);  
      await kontrakt.AddItem("Item 1", Number(1));
      await kontrakt.ArchiveItem(Number(0));
      await expect(kontrakt.ArchiveItem(Number(0))).to.be.rejectedWith("Item is already archived");
    });

    it("SellItem => error => Empty stack", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture); 
      await expect(kontrakt.SellItem(Number(0))).to.be.rejectedWith("Empty stack");
    });

    it("SellItem => error => Product out of the list", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture); 
      await kontrakt.AddItem("Item 1", Number(1));
      await expect(kontrakt.SellItem(Number(10))).to.be.rejectedWith("Product out of the list");
    });

    it("SellItem => error => Item is already for sale", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture);
      await kontrakt.AddItem("Item 1", Number(1));
      await expect(kontrakt.SellItem(Number(0))).to.be.rejectedWith("Item is already for sale");
    });

    it("SellItem => let for sale 1 item", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture); 
      await kontrakt.AddItem("Item 1", Number(1));
      const items = await kontrakt.GetAllItems();
      expect(items.length).to.equal(1);
      expect(items[0].name).to.equal("Item 1");
      expect(items[0].price).to.equal(1);
      expect(items[0].status).to.equal(0);
      await kontrakt.ArchiveItem(Number(0));
      const items2 = await kontrakt.GetAllItems();
      expect(items2.length).to.equal(1);
      expect(items2[0].name).to.equal("Item 1");
      expect(items2[0].price).to.equal(1);
      expect(items2[0].status).to.equal(1);
      await kontrakt.SellItem(Number(0));
      const items3 = await kontrakt.GetAllItems();
      expect(items3.length).to.equal(1);
      expect(items3[0].name).to.equal("Item 1");
      expect(items3[0].price).to.equal(1);
      expect(items3[0].status).to.equal(0);
    });

    it("AddToHistory => error => Product does not exist", async function(){
      const { kontrakt , addr1} = await loadFixture(deployTokenFixture); 
      await expect(kontrakt.AddToHistory(Number(10), addr1.address)).to.be.rejectedWith("Product does not exist");
    });

    it("GetAllHistory => error => Empty stack", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture); 
      await expect(kontrakt.GetAllHistory()).to.be.rejectedWith("Empty stack");
    });

    it("AddToHistory && GetAllHistory => add and check values", async function(){
      const { kontrakt , addr1} = await loadFixture(deployTokenFixture); 
      await kontrakt.AddItem("Item 1", Number(1));
      await kontrakt.AddToHistory(Number(0), addr1.address);
      const items = await kontrakt.GetAllHistory();
      expect(items.length).to.equal(1);
      expect(items[0].buyer).to.equal(addr1.address);
      expect(items[0].item_ID).to.equal(0);
    });

  });
  
  describe("Tickets", function() {

    it("NewTicket => error => Explanation cannot be empty" ,async function(){
      const { kontrakt , addr1, addr2} = await loadFixture(deployTokenFixture);
      await expect(kontrakt.NewTicket("", 10, addr1.address, addr2.address)).to.be.rejectedWith("Explanation cannot be empty");
    });
    
    it("reject => error => Empty stack", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture);
      await expect(kontrakt.reject(Number(1), "nie zgadzam sie")).to.be.rejectedWith("Empty stack");
    });

    it("reject => error => Index out of range", async function(){
      const { kontrakt , addr1, addr2} = await loadFixture(deployTokenFixture);
      await kontrakt.NewTicket("byl mily", 10, addr1.address, addr2.address);
      await expect(kontrakt.reject(Number(10), "nie zgadzam sie")).to.be.rejectedWith("Index out of range");
    });

    it("reject => error => Explanation cannot be empty", async function(){
      const { kontrakt , addr1, addr2} = await loadFixture(deployTokenFixture);
      await kontrakt.NewTicket("byl mily", 10, addr1.address, addr2.address);
      await expect(kontrakt.reject(Number(0), "")).to.be.rejectedWith("Explanation cannot be empty");
    });

    it("reject => error => Explanation cannot be empty", async function(){
      const { kontrakt ,addr1 ,addr2 } = await loadFixture(deployTokenFixture);
      await kontrakt.NewTicket("byl mily", 10, addr1.address, addr2.address);
      await expect(kontrakt.reject(Number(0), "")).to.be.rejectedWith("Explanation cannot be empty");
    });

    it("archiveTicket => error => Empty stack", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture);
      await expect(kontrakt.archiveTicket(Number(1))).to.be.rejectedWith("Empty stack");
    });

    it("archiveTicket => error => Index out of range", async function() {
      const { kontrakt , addr1 ,addr2 } = await loadFixture(deployTokenFixture);
      await kontrakt.NewTicket("byl mily", 10, addr1.address, addr2.address);
      await expect(kontrakt.archiveTicket(Number(1))).to.be.rejectedWith("Index out of range");
    });

    it("archiveTicket => error => Ticket is open", async function() {
      const { kontrakt , addr1 ,addr2 } = await loadFixture(deployTokenFixture);
      await kontrakt.NewTicket("byl mily", 10, addr1.address, addr2.address);
      await expect(kontrakt.archiveTicket(Number(0))).to.be.rejectedWith("Ticket is open");
    });

    it("archiveTicket => error => Ticket is archived", async function() {
      const { kontrakt , addr1 ,addr2 } = await loadFixture(deployTokenFixture);
      await kontrakt.NewTicket("byl mily", 10, addr1.address, addr2.address);
      await kontrakt.reject(Number(0), "jednak nie");
      await kontrakt.archiveTicket(Number(0));
      await expect(kontrakt.archiveTicket(Number(0))).to.be.rejectedWith("Ticket is archived");
    });

    it("NewTicket && GetAll &&  reject => add 2 tickets and check values", async function(){
      const { kontrakt , addr1, addr2} = await loadFixture(deployTokenFixture);
      await kontrakt.NewTicket("byl mily", 10, addr1.address, addr2.address);
      await kontrakt.NewTicket("byl mily 2", 20, addr1.address, addr2.address);
      await kontrakt.NewTicket("byl mily 3", 30, addr1.address, addr2.address);
      await kontrakt.reject(Number(0), "jednak nie");
      const AllTickets = await kontrakt.GetAll();
      expect(AllTickets.length).to.equal(3);
      expect(AllTickets[0].Explenation).to.equal("byl mily");
      expect(AllTickets[0].Status).to.equal(Number(2));
      expect(AllTickets[1].Explenation).to.equal("byl mily 2");
      expect(AllTickets[1].Status).to.equal(Number(0));
      expect(AllTickets[2].Explenation).to.equal("byl mily 3");
      expect(AllTickets[2].Status).to.equal(Number(0));
    });

    it("NewTicket && GetAll &&  reject && archiveTicket => add 2 tickets and check values", async function(){
      const { kontrakt , addr1, addr2} = await loadFixture(deployTokenFixture);
      await kontrakt.NewTicket("byl mily", 10, addr1.address, addr2.address);
      await kontrakt.NewTicket("byl mily 2", 20, addr1.address, addr2.address);
      await kontrakt.reject(Number(0), "jednak nie");
      await kontrakt.archiveTicket(Number(0));
      const AllTickets = await kontrakt.GetAll();
      expect(AllTickets.length).to.equal(2);
      expect(AllTickets[0].Status).to.equal(Number(3));
      expect(AllTickets[1].Status).to.equal(Number(0));
    });

    it("NewTicket && GetAll && GetMy && reject => add 2 tickets and check values", async function(){
      const { kontrakt , addr1, addr2} = await loadFixture(deployTokenFixture);
      await kontrakt.NewTicket("byl mily", 10, addr1.address, addr2.address);
      await kontrakt.NewTicket("byl mily 2", 20, addr2.address, addr1.address);
      await kontrakt.NewTicket("byl mily 3", 30, addr1.address, addr2.address);
      const AllTickets = await kontrakt.GetAll();
      expect(AllTickets.length).to.equal(3);
      expect(AllTickets[0].SenderWallet).to.equal(addr2.address);
      expect(AllTickets[0].ReciverWallet).to.equal(addr1.address);
      expect(AllTickets[1].SenderWallet).to.equal(addr1.address);
      expect(AllTickets[1].ReciverWallet).to.equal(addr2.address);
      expect(AllTickets[2].SenderWallet).to.equal(addr2.address);
      expect(AllTickets[2].ReciverWallet).to.equal(addr1.address);
      const SendTickets = await kontrakt.GetMy(addr1.address);
      expect(SendTickets.length).to.equal(2);
      expect(SendTickets[0].SenderWallet).to.equal(addr2.address);
      expect(SendTickets[0].ReciverWallet).to.equal(addr1.address);
      expect(SendTickets[1].SenderWallet).to.equal(addr2.address);
      expect(SendTickets[1].ReciverWallet).to.equal(addr1.address);
    });

    it("approveTicket", async function(){
      const { token , kontrakt, addr1 , addr2 } = await loadFixture(deployTokenAndContract);
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(1000000000000000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(0));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
      await kontrakt.NewTicket("byl mily", 10000000, addr1.address, addr2.address);
      await kontrakt.NewTicket("byl mily 2", 200000, addr2.address, addr1.address);
      await kontrakt.approveTicket(Number(0), "okey", token.address );
      const AllTickets = await kontrakt.GetAll();
      expect(AllTickets.length).to.equal(2);
      expect(AllTickets[0].Explenation).to.equal("byl mily");
      expect(AllTickets[0].Status).to.equal(Number(1));
      expect(AllTickets[0].TokenAmount).to.equal(10000000);
      expect(AllTickets[1].Explenation).to.equal("byl mily 2");
      expect(AllTickets[1].Status).to.equal(Number(0));
      expect(AllTickets[1].TokenAmount).to.equal(200000);
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(999999999990000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(10000000));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
    });
    
    it("approveTicket => error (after approveTicket) => Ticket is closed", async function(){
      const { token , kontrakt, addr1 , addr2 } = await loadFixture(deployTokenAndContract);
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(1000000000000000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(0));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
      await kontrakt.NewTicket("byl mily", 10000000, addr1.address, addr2.address);
      await kontrakt.NewTicket("byl mily 2", 200000, addr2.address, addr1.address);
      await kontrakt.approveTicket(Number(0), "okey", token.address );
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(999999999990000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(10000000));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
      await expect(kontrakt.approveTicket(Number(0), "okey", token.address )).to.be.rejectedWith("Ticket is closed");
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(999999999990000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(10000000));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
    });

    it("reject => error (after approveTicket) => Ticket is closed", async function(){
      const { token , kontrakt, addr1 , addr2 } = await loadFixture(deployTokenAndContract);
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(1000000000000000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(0));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
      await kontrakt.NewTicket("byl mily", 10000000, addr1.address, addr2.address);
      await kontrakt.NewTicket("byl mily 2", 200000, addr2.address, addr1.address);
      await kontrakt.approveTicket(Number(0), "okey", token.address );
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(999999999990000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(10000000));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
      await expect(kontrakt.reject(Number(0), "okey")).to.be.rejectedWith("Ticket is closed");
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(999999999990000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(10000000));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
    });


    it("approveTicket && archiveTicket", async function(){
      const { token , kontrakt, addr1 , addr2 } = await loadFixture(deployTokenAndContract);
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(1000000000000000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(0));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
      await kontrakt.NewTicket("byl mily", 10000000, addr1.address, addr2.address);
      await kontrakt.NewTicket("byl mily 2", 200000, addr2.address, addr1.address);
      await kontrakt.approveTicket(Number(0), "okey", token.address );
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(999999999990000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(10000000));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
      await kontrakt.archiveTicket(Number(0));
      const AllTickets = await kontrakt.GetAll();
      expect(AllTickets.length).to.equal(2);
      expect(AllTickets[0].Status).to.equal(3);
      expect(AllTickets[1].Status).to.equal(0);
    });

    it("approveTicket => error (after reject) => Ticket is closed", async function(){
      const { token , kontrakt, addr1 , addr2 } = await loadFixture(deployTokenAndContract);
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(1000000000000000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(0));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
      await kontrakt.NewTicket("byl mily", 10000000, addr1.address, addr2.address);
      await kontrakt.NewTicket("byl mily 2", 200000, addr2.address, addr1.address);
      await kontrakt.reject(Number(0), "okey");
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(1000000000000000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(0));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
      await expect(kontrakt.approveTicket(Number(0), "okey", token.address )).to.be.rejectedWith("Ticket is closed");
      expect(await token.balanceOf(kontrakt.address)).to.equal(BigInt(1000000000000000000));
      expect(await token.balanceOf(addr1.address)).to.equal(BigInt(0));
      expect(await token.balanceOf(addr2.address)).to.equal(BigInt(0));
    });

  });

  describe("Workers" , function() {

    it("addUser && getUser => add first user", async function(){
      const { kontrakt , addr1} = await loadFixture(deployTokenFixture);
      await kontrakt.addUser(addr1.address, "Jan", "Kowalski", "jkowalski@wp.pl", Number(0) );
      const items = await kontrakt.getUser(addr1.address);
      expect(items.user).to.equal(addr1.address);
      expect(items.Name).to.equal("Jan");
      expect(items.Surname).to.equal("Kowalski");
      expect(items.Email).to.equal("jkowalski@wp.pl");
      expect(items.Rank).to.equal(0);
    });

    it("addUser && getAllUsers => add 2 users", async function(){
      const { kontrakt , addr1, addr2} = await loadFixture(deployTokenFixture);
      await kontrakt.addUser(addr1.address, "Jan", "Kowalski", "jkowalski@wp.pl", Number(0) );
      await kontrakt.addUser(addr2.address, "Jan", "Nowacki", "jnowacki@wp.pl", Number(1) );
      const items = await kontrakt.getAllUsers();
      expect(items.length).to.equal(2);
      expect(items[0].user).to.equal(addr1.address);
      expect(items[0].Name).to.equal("Jan");
      expect(items[0].Surname).to.equal("Kowalski");
      expect(items[0].Email).to.equal("jkowalski@wp.pl");
      expect(items[0].Rank).to.equal(0);
      expect(items[1].user).to.equal(addr2.address);
      expect(items[1].Name).to.equal("Jan");
      expect(items[1].Surname).to.equal("Nowacki");
      expect(items[1].Email).to.equal("jnowacki@wp.pl");
      expect(items[1].Rank).to.equal(1);
    });

    it("addUser => error => User is existing", async function(){
      const { kontrakt , addr1} = await loadFixture(deployTokenFixture);
      await kontrakt.addUser(addr1.address, "Jan", "Kowalski", "jkowalski@wp.pl", Number(0) );
      await expect(kontrakt.addUser(addr1.address, "Jan", "Kowalski", "jkowalski@wp.pl", Number(0) )).to.be.rejectedWith("User is existing");
    });

    it("change_role => error => Empty Stack", async function(){
      const { kontrakt } = await loadFixture(deployTokenFixture);
      await expect(kontrakt.change_role(Number(0) , Number(2))).to.be.rejectedWith("Empty Stack");
    });

    it("change_role => error => ID out of the scope", async function(){
      const { kontrakt , addr1} = await loadFixture(deployTokenFixture);
      await kontrakt.addUser(addr1.address, "Jan", "Kowalski", "jkowalski@wp.pl", Number(0) );
      await expect(kontrakt.change_role(Number(10) , Number(2))).to.be.rejectedWith("ID out of the scope");
    });

  });

});