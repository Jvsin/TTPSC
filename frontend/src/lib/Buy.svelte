<script>
    import { onMount} from 'svelte';
    import { ethers } from "ethers";

    // Importing compiled files (artifacts and addresses)
    import KontraktArtifact from "../contracts/Kontrakt.json";
    import kontraktAddress from "../contracts/kontrakt-address.json";
    import Token_testArtifact from "../contracts/Token_test.json";
    import tokenAddress from "../contracts/token-address.json";

    // This object stores information regarding the blockchain
    export const initialState = {
        selectedAddress: undefined,
        items: undefined,
        history: undefined,
        connections: undefined,
        balance: undefined,
        _kontrakt: undefined,
        _token: undefined,
        _provider: undefined
    }

     // This objects stores form information
     export const formValidation = {
        name: undefined,
        price: undefined,
    }

    // This variable will be used for storing error messages that will be displayed on the client's side
    export let statusMessage = "";

    // Initializing contracts (in this case only one becauce it inherits all the functionality of the rest)
    async function initializeEthers() {
        initialState._provider = new ethers.providers.Web3Provider(window.ethereum);
        initialState.selectedAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });

        initialState._kontrakt = new ethers.Contract(
            kontraktAddress.Kontrakt,
            KontraktArtifact.abi,
            initialState._provider.getSigner(0)
        );

        initialState._token = new ethers.Contract(
            tokenAddress.Token,
            Token_testArtifact.abi,
            initialState._provider.getSigner(0)
        );

        // Getting all added items that are for sale
        initialState.items = await _getAllItems();
        console.log("Items: ", initialState.items);
    }

    // Resolving a promise which will indicate whether the user is connected or not
    async function getConnections() {
        return await initialState._provider.listAccounts().then((result) => {
            return result;
        }).catch((err) => {
            console.log("code: ", err.code, "\nmessage: ", err.message);
        });
    };

    // Getting all items that are for sale
    async function _getAllItems() {
        return initialState._kontrakt.GetAllItems().then((result) => {
            return result;
        }).catch((err) => {
            console.log("code: ", err.code);
        });
    }

    // Getting balance of the current user
    async function _balanceOf(address) {
        return await initialState._token.balanceOf(String(address)).then((result) => {
            return result;
        }).catch((err) => {
            console.log("code: ", err.code, "\nmessage: ", err.message);
        });
    }

    // Archiving item
    async function _archiveItem(id) {
        await initialState._kontrakt.ArchiveItem(Number(id)).then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    }

    // Buying items
    async function _buyItem(id, address, amount) {
        try {
            // Checking the connection
            initialState.connections = await getConnections();

            if (!initialState.connections.length) {
                statusMessage = "Please connect your wallet with metamask";
                return;
            }

            // Getting the balance
            initialState.balance = await _balanceOf(initialState.selectedAddress[0]);

            if (!initialState.balance.toNumber() || initialState.balance.toNumber() < Number(amount)) {
                throw {
                    message: "Insufficient balance"
                }
            }

            // Doing transaction
            await initialState._token.transfer(initialState._token.address, Number(amount));
            await initialState._kontrakt.buyItem(Number(id), String(address), {gasLimit: 540000});
            
        } catch(err) {
            console.log(err.message);
        }
    }

    onMount(() => {
        initializeEthers();
    });
</script>

<div class="content-buy">
    {#if initialState.items}
        {#each initialState.items as item}
            <div class="item">
                <div class="item-desc">
                    <p>{item['name']}</p>
                </div>
                <div class="item-interact">
                    <button on:click={() => {_buyItem(item['id'], initialState.selectedAddress[0], item['price'])}} class="small-red-btn">Buy</button>
                    <p>Price: {item['price']}</p>
                </div>
            </div>
        {/each}
    {/if}
</div>

<style>
    .content-buy {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-flow: row wrap;
    }

    .content-buy .item {
        width: 370px;
        height: 260px;
        background: rgb(255, 255, 255);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.664), 0 3px 6px rgba(0, 0, 0, 0.589);
        transition: 300ms ease-in-out;
        border-radius: 20px;
        margin: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        letter-spacing: 2px;
        position: relative;
        top: 0;
    }

    .content-buy .item:hover {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.664), 0 6px 6px rgba(0, 0, 0, 0.589);
        top: -10px;
    }

    .item .item-interact {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        position: relative;
        top: 70px;
        left: 0;
    }

    .item-interact .small-red-btn:hover {
        background: rgb(194, 54, 22);
    }

    .item .small-red-btn {
        outline: none;
        color: rgb(0, 0, 0);
        width: 100px;
        height: 30px;
        background: rgb(234, 32, 39);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 300ms ease-in-out;
        -webkit-tap-highlight-color: transparent;
        letter-spacing: 2px;
        font-weight: 500;
        border-radius: 30px;
        border: none;
        cursor: pointer;
        position: relative;
        left: -30px;
        top: -3px;
    }
</style>