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
        tickets: [],
        history: [],
        _kontrakt: undefined,
        _token: undefined,
        _provider: undefined
    }

    // Initializing contracts
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

        // Getting all the tickets for the user and sorting them
        const ticketsResult = await _getMyTickets(initialState.selectedAddress[0]);
        if (ticketsResult !== "CALL_EXCEPTION") {
            initialState.tickets = await sortingTickets(ticketsResult);
        }

        // Getting commerce history if user is administrator
        if (initialState.user['Rank'] > 0) {
            initialState.history = await _getAllHistory();
        }
    }

    // converting secunds to a date
    function convertSecondsToDate(seconds) {
        let date = new Date(seconds * 1000);
        return date.toLocaleString();
    }

    // Sorting tickets
    async function sortingTickets(array) {
        const newArray = await array.filter(element => {
            if (element['Status'] === 1) {
                return element;
            }
        });

        return newArray;
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
            return result;
        }).catch((err) => {
            console.log("Awards error code: ", err.code)
            return err.code;
        });
    }

    // Archiving awards
    async function _archiveTicket(id) {
        await initialState._kontrakt.archiveTicket(Number(id)).then((result) => {
            console.log(result)
        }).catch((err) => {
            console.log("code: ", err.code);
        });
    }


    // Loading history of commerce
    async function _getAllHistory() {
        return await initialState._kontrakt.GetAllHistory().then((result) => {
            return result;
        }).catch((err) => {
            console.log("History error code: ", err.code);
            return err.code;
        });
    }

    onMount(() => {
        initializeEthers();
    })
</script>

<div class="container-profile">
    <div class="profile-items">
        <div class="profile-card">
            <div class="profile-img"></div>
            {#if initialState.user && initialState.balance}

                <h1>{initialState.user['Name']} {initialState.user['Surname']}</h1>
                <p>Balance: <b>{initialState.balance.toNumber()}</b></p>
            {/if}
            <div class="pikabu">
                <p>⚡</p>
            </div>
        </div>

        {#if initialState.user && initialState.user['Rank']}
            <div class="items-history">
                {#if initialState.history === "CALL_EXCEPTION"}
                    <div class="no-history">
                        <h2>#Empty stack</h2>
                    </div>

                {:else}
                    {#each initialState.history as raport}
                        <div class="history-card">
                            <p>Buyer: <b>{raport['buyer']}<b></p>
                            <p>Date: <b>{convertSecondsToDate(raport['data'].toNumber())}</b></p>
                            <p>Item ID: <b>{raport['item_ID']}</b></p>
                        </div>
                    {/each}
                {/if}
            </div>
        {/if}
    </div>

    <div class="profile-awards">
        {#if !initialState.tickets.length}
            <div class="no-awards">
                <h2>#No awards yet 😒</h2>
            </div>
        {/if}

        {#each initialState.tickets as ticket}
            <div class="award">
                <div class="btns">
                    <button on:click={() => _archiveTicket(ticket['id'])} class="btn-reject"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <p>From: <b>{ticket['SenderWallet']}<b></p>
                <p>For: <b>{ticket['Explenation']}</b></p>
                <p>Amount: <b>{ticket['TokenAmount']}</b></p>
            </div>
        {/each}
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
        height: auto;
        display: flex;
        justify-content: center;
        align-items: baseline;
        flex-flow: column wrap;
        margin-bottom: 20px;
    }

    .profile-items .profile-card {
        width: 100%;
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
        margin-bottom: 20px;
    }

    .profile-card * {
        margin: 10px;
    }

    .profile-items .items-history {
        width: 100%;
        height: 400px;
        background: rgb(20, 22, 26);
        border-radius: 20px;
        overflow-y: scroll;
    }

    .items-history .history-card {
        width: calc(100% - 20px);
        height: auto;
        margin: 20px auto;
        border-radius: 20px;
        padding: 20px 0 ;
        text-align: center;
        overflow-wrap: break-word;
        color: rgba(55, 55, 55, 0.8);
        background: rgb(255, 255, 255);
    }

    .profile-items .items-history::-webkit-scrollbar {
        width: 5px;
        border-radius: 100px;
    }

    .profile-items .items-history::-webkit-scrollbar-thumb {
        background-color: rgb(192, 57, 43);
        outline: none;
        border-radius: 50px;
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
        overflow-y: scroll;
    }

    .container-profile .profile-awards::-webkit-scrollbar {
        width: 5px;
        border-radius: 100px;
    }

    .container-profile .profile-awards::-webkit-scrollbar-thumb {
        background-color: rgb(255, 255, 255);
        outline: none;
        border-radius: 50px;
    }

    .profile-awards .award {
        width: calc(100% - 20px);
        height: auto;
        background: rgb(192, 57, 43);
        margin: 20px auto;
        border-radius: 20px;
        color: rgb(255, 255, 255);
        padding-bottom: 20px;
        text-align: center;
        overflow-wrap: break-word;
    }

    .profile-awards .no-awards,
    .items-history .no-history {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgb(255, 255, 255);
        letter-spacing: 3px;
    }

    .award .btns {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: end;
        align-items: center;
        color: rgb(255, 255, 255);
    }

    .btns button {
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: none;
        margin-right: 10px;
        cursor: pointer;
        background: rgba(55, 55, 55, 0.5);;
        color: rgb(255, 255, 255);
        transition: 300ms ease-in-out;
        font-size: 10px;
    }

    .btns button:hover {
        background: rgba(55, 55, 55, 0.8);;
    }

    @media only screen and (max-width: 750px) {
        .container-profile .profile-awards,
        .container-profile .profile-items  {
            width: calc(100vw - 30px);
        }
    }

</style>