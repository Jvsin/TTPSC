<script>
    import { onMount } from 'svelte';
    import { ethers } from "ethers";

    // Importing compiled files (artifacts and addresses but in this case only one becauce it inherits all the functionality of the rest)
    import KontraktArtifact from "../contracts/Kontrakt.json";
    import kontraktAddress from "../contracts/kontrakt-address.json";

    // This object stores information regarding the blockchain
    export const initialState = {
        selectedAddress: undefined,
        connections: undefined,
        _kontrakt: undefined,
        _provider: undefined
    }

    // This objects stores form information
    export const formValidation = {
        address: undefined,
        amount: undefined,
        explanation: undefined,
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
    }

    // Resolving a promise which will indicate whether the user is connected or not
    async function getConnections() {
        return await initialState._provider.listAccounts().then((result) => {
            return result;
        }).catch((err) => {
            console.log("code: ", err.code, "\nmessage: ", err.message);
        });
    }

    // Creating new ticket which will be resolved by administrator
    async function _newTicket() {
        try {
            let {address, amount, explanation} = formValidation;

            // Checking the connection
            initialState.connections = await getConnections();

            if (!initialState.connections.length) {
                statusMessage = "Please connect your wallet with metamask";
                return;
            }

            if (!address || !amount || !explanation) {
                statusMessage = "Failed - incomplete form";
                throw {
                    address: address,
                    amount: amount,
                    explanation: explanation,
                    message: "Incomplete form"
                }
            }

            await initialState._kontrakt.NewTicket(explanation, Number(amount), address, initialState.selectedAddress[0])

            statusMessage ="Succeed - ticket sent";
            formValidation.address = '';
            formValidation.amount = '';
            formValidation.explanation = ''
        } catch(err) {
            console.error(err.message, err.address, err.amount, err.explanation);
        }
    }

    onMount(() => {
        initializeEthers();
    })
</script>

<div class="content-give">
    <div class="form-box">
        <form action="">
            <h1 class="form-item">Sending Tokens</h1>
    
            <div class="form-item input-address">
                <label for="address">Address</label><br>
                <input bind:value={formValidation.address} required type="text" name="address">
            </div>
            <div class="form-item input-amount">
                <label for="amount">Tokens</label><br>
                <input bind:value={formValidation.amount} required type="number" name="amount" min="1">
            </div>
            <div class="form-item input-explanation">
                <label for="explanation">Explanation</label><br>
                <textarea bind:value={formValidation.explanation} required name="explanation"></textarea>
            </div>
            <div class="form-item buttons">
                <button on:click={_newTicket} type="button" class="form-item btn" name="send">Send</button>
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

<style>
     .form-box {
        width: 600px;
        height: 720px;
        text-align: center;
        border-radius: 20px;
        color: rgb(255, 255, 255);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column wrap;
        background: transparent;
        box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);
        backdrop-filter: blur(9.6px);
        -webkit-backdrop-filter: blur(9.6px);
    }

    form .form-item {
        margin: 15px 0;
    }

    .content-give {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column wrap;
    }

    textarea {
        width: 300px;
        height: 200px;
        resize: none;
        outline: none;
        border-radius: 10px;
        background: transparent;
        border: 2px solid rgb(255, 255, 255);
        font-size: 16px;
        font-weight: 500;
        padding: 5px;
        color: rgb(255, 255, 255);
        margin: 5px 0;
    }

    @media only screen and (max-width: 650px) {
        .form-box {
            width: calc(100vw - 20px);
            font-size: 3vw;
        }

        input, textarea {
            width: calc(100vw - 50px)
        }
    }
</style>