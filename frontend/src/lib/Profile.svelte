<script>
    import { onMount, tick} from 'svelte';
    import { ethers } from "ethers";

    // Importing compiled files (artifacts and addresses)
    import KontraktArtifact from "../contracts/Kontrakt.json";
    import kontraktAddress from "../contracts/kontrakt-address.json";
    import Token_testArtifact from "../contracts/Token_test.json";
    import tokenAddress from "../contracts/token-address.json";

    // This object stores information regarding the blockchain
    export const initialState = {
        selectedAddress: undefined,
        user: undefined,
        balance: undefined,
        tickets: undefined,
        _kontrakt: undefined,
        _token: undefined,
        _provider: undefined
    }

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

        // Getting current user
        initialState.user = await _getUser(initialState.selectedAddress[0]);
        
        // Getting current user's balance
        initialState.balance = await _balanceOf(initialState.selectedAddress[0]);

        // Getting curent user's awards
        initialState.tickets = await _getMyTickets(initialState.selectedAddress[0]);
    }

     // Searches for a user of the givven address and returns it in a resolved promise
     async function _getUser(address) {
        return await initialState._kontrakt.getUser(String(address)).then((result) => {
            return result;
        }).catch((err) => {
            statusMessage = "Failed - inner error"
            console.log("code: ", err.code, "\nmessage: ", err.message);
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

    // Getting awards for the user
    async function _getMyTickets(address) {
        return await initialState._kontrakt.GetMy(String(address)).then((result) => {
            return result
        }).catch((err) => {
            console.log("code: ", err.code);
        });
    }

    onMount(() => {
        initializeEthers();
    })
</script>

<div class="container-profile">
    <div class="profile-items">
        {#if initialState.user && initialState.balance}
            <div class="profile-img"></div>
            <h1>{initialState.user['Name']} {initialState.user['Surname']}</h1>
            <p>Balance: <b>{initialState.balance.toNumber()}</b></p>
        {/if}
        <div class="pikabu">
            <p>⚡</p>
        </div>
    </div>

    <div class="profile-awards">
        {#if initialState.tickets}
            {#each initialState.tickets as ticket}
                {#if tick['Status' == 1]}
                    <div class="award">
                            <p>From: <b>{ticket['SenderWallet']}<b></p>
                            <p>Reason: <b>{ticket['Explenation']}</b></p>
                            <p>Amount: <b>{ticket['TokenAmount']}</b></p>
                    </div>
                {/if}
            {/each}
        {/if}
    </div>
</div>

<style>

    .container-profile {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-flow: row wrap;
    }

    .container-profile .profile-items {
        width: 600px;
        height: 400px;
        color: rgb(255, 255, 255);
        background: transparent;
        box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);
        backdrop-filter: blur(9.6px);
        -webkit-backdrop-filter: blur(9.6px);
        text-align: center;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column wrap;
    }

    .profile-items * {
        margin: 10px;
    }

    .profile-items .profile-img {
        width: 100px;
        height: 100px;
        border-radius: 50px;
        border: 2px solid rgb(255, 255, 255);
    }

    .container-profile .profile-awards {
        width: 600px;
        height: 650px;
        background: rgb(20, 22, 26);
        border-radius: 20px;
    }

    .profile-awards .award {
        width: calc(100% - 20px);
        height: auto;
        background: rgb(192, 57, 43);
        margin: 10px auto;
        border-radius: 20px;
        color: rgb(255, 255, 255);
        padding: 20px 0;
        text-align: center;
    }

</style>