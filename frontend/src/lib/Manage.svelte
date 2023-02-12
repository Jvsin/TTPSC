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
        tickets: undefined,
        connections: undefined,
        _kontrakt: undefined,
        _token: undefined,
        _provider: undefined
    }

     // This objects stores form information
     export const formValidation = {
        name: undefined,
        price: undefined,
        explanation: []
    }

    // this variable will be used for storing error messages that will be displayed on the client's side
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

        // Getting all sent tickets
        initialState.tickets = await _getSentTickets();
        console.log("Tickets: ", initialState.tickets);
    }

    // Resolving a promise which will indicate whether the user is connected or not
    async function getConnections() {
        return await initialState._provider.listAccounts().then((result) => {
            return result;
        }).catch((err) => {
            console.log("code: ", err.code, "\nmessage: ", err.message);
        });
    } 

    // Returns all sent tickets
    async function _getSentTickets() {
        return await initialState._kontrakt.GetSent().then((result) => {
            return result
        }).catch((err) => {
            console.error("code: ", err.code);
        });
    }

    // Adding new items to marketplace
    async function addNewItem() {
        try {
            let {name, price} = formValidation;

            // Checking the connection
            initialState.connections = await getConnections();

            if (!initialState.connections.length) {
                statusMessage = "Please connect your wallet with metamask";
                return;
            }

            if (!name || price < 0) {
                statusMessage = "Failed - incomplete form or incorrect input";
                throw {
                    name: name,
                    price: price,
                    message: "Incomplete form or incorrect input"
                }
            }

            await initialState._kontrakt.AddItem(name, Number(price));
            statusMessage ="Succeed - item added";
        } catch(err) {
            console.error(err.message, err.name, err.price)
        } finally {
            formValidation.name = '';
            formValidation.price = '';
        }
    }

    // Transfering money
    async function _transfer(address, amount) {
        return initialState._token.transfer(String(address), Number(amount)).then((result) => {
            return result
        }).catch((err) => {
            console.error("code: ", err.code, "\nmessage: ", err.message);
        });
    }

    // Approving ticket
    async function _approveTicket(id, i, address, amount) {
        try {
            let {explanation} = formValidation;

            // Checking the connection
            initialState.connections = await getConnections();

            if (!initialState.connections.length) {
                statusMessage = "Please connect your wallet with metamask";
                return;
            }

            if (!explanation[i]) {
                statusMessage = "Failed - incomplete form";
                throw {
                    explanation: explanation,
                    message: "Incomplete form"
                }
            }

            await initialState._kontrakt.approveTicket(Number(id), explanation[i], initialState._token.address);
            const tx = await _transfer(String(address), Number(amount),  {gasLimit: 540000});
            const result = await tx.wait();
            
            if (result.status) {
                statusMessage ="Succeed - notification resolved"
            } else {
                statusMessage ="Failed - transaction error"
            }
        } catch(err) {
            console.error(err.message, err.explanation)
        } finally {
            formValidation.explanation[i] = ''
        }
    } 

    // Rejecting ticket
    async function _rejectTicket(id, i) {
        try {
            let {explanation} = formValidation;

            // Checking the connection
            initialState.connections = await getConnections();

            if (!initialState.connections.length) {
                statusMessage = "Please connect your wallet with metamask";
                return;
            }

            if (!explanation[i]) {
                statusMessage = "Failed - incomplete form";
                throw {
                    explanation: explanation,
                    message: "Incomplete form"
                }
            }

            await initialState._kontrakt.reject(Number(id), explanation[i]);
            statusMessage ="Succeed - notification resolved";
        } catch(err) {
            console.error(err.message, err.explanation)
        } finally {
            formValidation.explanation[i] = ''
        }
    }

    onMount(() => {
        initializeEthers();
    });
</script>

<div class="content-manage">
    <div class="manage-notifications">
        <div class="notifications-box">
            {#if initialState.tickets}
                {#each initialState.tickets as ticket, i}
                    <div class="notification">
                        <div class="btns">
                            <button on:click={() => {_approveTicket(ticket['id'],  i, ticket['ReciverWallet'], ticket['TokenAmount'])}} class="btn-approve"><i class="fa-solid fa-check"></i></button>
                            <button on:click={() => {_rejectTicket(ticket['id'], i)}} class="btn-reject"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                        <div class="text">
                            <p>Sender: <b>{ticket['SenderWallet']}<b></p>
                            <p>Reciver: <b>{ticket['ReciverWallet']}</b></p>
                            <p>Explanation: <b>{ticket['Explenation']}</b></p>
                            <p>Amount: <b>{ticket['TokenAmount']}</b></p>
                            
                            <form action="">
                                <div class="form-item input-explanation">
                                    <label for="explanation">Explanation</label><br>
                                    <input  bind:value={formValidation.explanation[i]} class="ticket-explain" required name="explanation">
                                </div>
                            </form>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>

    <div class="manage-items">
        <div class="form-box">
            <form action="">
                <h1 class="form-item">Create new item</h1>
    
                <div class="form-item input-name">
                    <label for="name">Name</label><br>
                    <input bind:value={formValidation.name} required type="text" name="name">
                </div>
                <div class="form-item input-price">
                    <label for="price">Price</label><br>
                    <input bind:value={formValidation.price} required type="number" name="price" min="1">
                </div>
                <div class="form-item buttons">
                    <button on:click={addNewItem} type="button" class="form-item btn" name="send">Add</button>
                </div>
                <div class="form-item">
                    <p>{statusMessage}</p>
                </div>
                <div class="pikabu">
                    <p>⚡</p>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
    /* Notification content */
    .content-manage {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-flow: row wrap;
    }

    .content-manage .manage-notifications {
        width: 600px;
        height: auto;
        text-align: center;
    }

    .manage-notifications .notifications-box {
        width: 100%;
        height: 650px;
        border-radius: 20px;
        background: rgb(20, 22, 26);
        flex-flow: column;
        overflow-y: scroll;
        color: rgba(55, 55, 55, 0.8);
    }

    .manage-notifications .notifications-box::-webkit-scrollbar {
        width: 5px;
        border-radius: 100px;
    }

    .manage-notifications .notifications-box::-webkit-scrollbar-thumb {
        outline: none;
        border-radius: 50px;
    }

    .notifications-box .notification {
        width: 95%;
        height: auto;
        margin: 20px auto;
        padding-bottom: 5px;
        border-radius: 20px;
        background: rgb(255, 255, 255);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.664), 0 3px 6px rgba(0, 0, 0, 0.589);
        text-align: center;
    }

    .notification .text {
        padding: 0 10px;
    }

    .notification .text * {
        margin-bottom: 12px;
    }

    .notification .btns {
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
     /* Notification content */

    .form-box {
        width: 600px;
        height: 600px;
        text-align: center;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column wrap;
        background: transparent;
        box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);
        backdrop-filter: blur(9.6px);
        -webkit-backdrop-filter: blur(9.6px);
        color: rgb(255, 255, 255);
        margin-top: 30px;
        padding: 0 10px;
    }

    form .form-item {
        margin: 15px 0;
    }

    .input-explanation {
        color: rgba(55, 55, 55, 0.8);
    }

    .input-explanation input {
        border-color: rgba(55, 55, 55, 0.8);
        color: rgba(55, 55, 55, 0.8);
    }

    @media only screen and (max-width: 760px) {
        .form-box, .content-manage .manage-notifications {
            width: calc(100vw - 35px);
        }

        .notifications-box .notification {
            font-size: 3vw;
        }

        input {
            width: calc(100% - 10px);
        }
    }
</style>