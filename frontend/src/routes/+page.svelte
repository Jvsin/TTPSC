<script>
    import { onMount } from 'svelte';
    import { ethers } from "ethers";
    import Canvas from "../lib/Canvas.svelte";

    // Importing compiled files (artifacts and addresses but in this case only one becauce it inherits all the functionality of the rest)
    import KontraktArtifact from "../contracts/Main.json";
    import kontraktAddress from "../contracts/kontrakt-address.json";

    // This object stores information regarding the blockchain
    export const initialState = {
        selectedAddress: undefined,
        accountsArray: undefined,
        connections: undefined,
        _kontrakt: undefined,
        _provider: undefined
    }

    // This objects stores form information
    export const formValidation = {
        address: undefined,
        name: undefined,
        surname: undefined,
        email: undefined,
        role: undefined,
    }

    // this variable will be used for storing error messages that will be displayed on the client's side
    export let statusMessage = "";

    // Connecting user's wallet
    async function walletConnection() {
        if (window.ethereum === undefined) {
            statusMessage = "Please install an Ethereum provider"
        } else {
            initialState.selectedAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            if (initialState.selectedAddress) {
                statusMessage = "You're connected!"
                console.log("connection: ", true);
            } else {
                console.log("connection: ", false);
                statusMessage = "You arne't connected!"
            }
        }
    }

    // Resolving a promise which will indicate whether the user is connected or not
    async function getConnections() {
        return await initialState._provider.listAccounts().then((result) => {
            return result;
        }).catch((err) => {
            console.log("code: ", err.code, "\nmessage: ", err.message);
        });
    }

    // Loading the marketplace if user has connected their wallet
    async function loadMarketplace() {
        initialState.connections = await getConnections();

        if (initialState.connections.length) {
            window.window.location.assign("./content");
        } else {
            statusMessage = "Please connect your wallet with metamask";
        }
    }

    // Initializing contracts (in this case only one (kontrakt) becauce it inherits all the functionality of the rest)
    async function initializeEthers() {
        initialState._provider = new ethers.providers.Web3Provider(window.ethereum);

        initialState._kontrakt = new ethers.Contract(
            kontraktAddress.Kontrakt,
            KontraktArtifact.abi,
            initialState._provider.getSigner(0)
        );
    }

    // Function that registers users
    async function _addUser() {
        try {
            let {address, name, surname, email, role} = formValidation;
            
            initialState.connections = await getConnections();

            if (!initialState.connections.length) {
                statusMessage = "Please connect your wallet with metamask";
                return;
            }

            if (!address || !name || !surname || !email || !role) {
                statusMessage = "Failed - incomplete form";
                throw {
                    address: address,
                    name: name,
                    surname: surname,
                    email: email,
                    role: role,
                    message: "Incomplete form"
                }
            }

            // Checking the current user exists in the blockchain
            initialState.accountsArray = await _getUser(initialState.connections[0]);

            if (initialState.accountsArray['Rank'] < 1 || initialState.accountsArray['Rank'] > 2) {
                statusMessage = "Failed - no permisiton granted to register";
                return;
            }

            await initialState._kontrakt.addUser(address, name, surname, email, Number(role), {gasLimit: 540000});
            statusMessage ="Succeed - user registered";
            formValidation.address = '';
            formValidation.name = '';
            formValidation.surname = '';
            formValidation.email = '';
            formValidation.role = '';
        } catch(err) {
            console.error(err.message, err.address, err.name, err.surname, err.email, err.role);
        } finally {
            _getAllUsers();
        }
    }

    // Retrieving all registered users if the stack isn't empty it stores the array in initialState
    async function _getAllUsers() {
        await initialState._kontrakt.getAllUsers().then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log("code: ", err.code, "\nmessage: ", err.message);
        });
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

    onMount(() => {
        initializeEthers();
        // _addUser('0x10405B8c49823F1f67307BC92589863a20CB8Eb5', 'ronald', 'frangulyan', 'ja@mail.com', 0);
        // _getAllUsers();
    })
</script>

<div class="container">
    <div class="form-box">
        <form action="">
            <h1 class="form-item">User Registration</h1>

            <div class="form-item input-address">
                <label for="address">Address</label><br>
                <input required type="text" name="address" bind:value={formValidation.address}>
            </div>
            <div class="form-item input-name">
                <label for="name">Name</label><br>
                <input required type="text" name="name" bind:value={formValidation.name}>
            </div>
            <div class="form-item input-surname">
                <label for="surname">Surname</label><br>
                <input required type="text" name="surname" bind:value={formValidation.surname}>
            </div>
            <div class="form-item input-email">
                <label for="email">Email</label><br>
                <input required type="email" name="email" bind:value={formValidation.email}>
            </div>
            <div class="form-item input-role">
                <label for="role">Role</label><br>
                <select name="role" bind:value={formValidation.role}>
                    <option value="0">Employee</option>
                    <option value="1">HR</option>
                    <option value="2">Admin</option>
                </select>
            </div>
            <div class="form-item buttons">
                <button on:click={_addUser} type="button" class="form-item btn" name="sign-up">Register</button>
            </div>
            <div class="form-item">
                <p>{statusMessage}</p>
            </div>

            <div class="pikabu">
                <p>⚡</p>
            </div>
        </form>
    </div>
    <div class="text-box">
        <h1>Lorem ipsum</h1>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus at nibh in pellentesque. 
            Praesent tincidunt nulla vestibulum nunc bibendum eleifend. Nam fringilla, nulla eget imperdiet rhoncus, nulla sapien varius ligula, 
            a efficitur lacus eros sit amet nisi. Praesent at maximus quam. Suspendisse mollis turpis vitae sagittis consectetur. 
            Sed vel posuere nibh, sed tincidunt dui. Proin ante dui, bibendum ac elementum sed, convallis non tellus. Mauris eros mauris, 
            sollicitudin et libero sit amet, lobortis mollis enim.
        </p>
        <div class="red-buttons">
            <button class="red-btn" on:click={walletConnection}>Connect Wallet</button>
            <button class="red-btn" on:click={loadMarketplace}>Marketplace</button>
        </div>
    </div>
</div>
<Canvas />

<style>
    select {
        -moz-appearance:none;
        -webkit-appearance:none;
        appearance:unset;
        width: 300px;
        height: 40px;
        outline: none;
        border-radius: 10px;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        margin: 5px 0;
        border: 1px solid rgb(255, 255, 255)
    }

    button.red-btn {
        outline: none;
        color: rgb(0, 0, 0);
        margin: 10px;
        letter-spacing: 2px;
        font-weight: 500;
        width: 200px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgb(234, 32, 39);
        border-radius: 30px;
        border: none;
        transition: 300ms ease-in-out;
        -webkit-tap-highlight-color: transparent;
        cursor: pointer;
    }

    button.red-btn:hover {
        background: rgb(194, 54, 22);
    }

    .container {
        width: 100vw;
        height: auto;
        padding: 100px 0;
        background: transparent;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-flow: row wrap;
    }

    .container .form-box {
        width: 700px;
        height: 730px;
        border-radius: 30px;
        text-align: center;
        background: transparent;
        box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);
        backdrop-filter: blur(9.6px);
        -webkit-backdrop-filter: blur(9.6px);
        color: rgb(255, 255, 255);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column wrap;
    }

    .form-box .form-item {
        margin: 15px 0;
    }

    .form-box .pikabu {
        margin-top: 25px;
        text-align: center;
    }

    .container .text-box {
        width: 700px;
        height: 600px;
        text-align: justify;
        color: rgb(255, 255, 255);
        letter-spacing: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column wrap;
    }

    .text-box * {
        margin: 30px 0;
    }

    .text-box .red-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: row wrap;
    }

    .text-box h1 {
        font-size: 5vw;
    }

    @media only screen and (max-width: 1030px) {
        .container {
            padding: 100px 0;
        }

        .container .form-box {
            width: calc(100vw - 35px);
        }

        .text-box h1 {
            font-size: 8vw;
        }

        .text-box p {
            font-size: 11px;
        }
    }

    @media only screen and (max-width: 800px) {
        input[type=text], input[type=email], select {
            width: calc(100% - 30px);
        }

        .container {
            height: 100vh;
            padding: 0;
        }
    }

    @media only screen and (max-width: 400px) {
        input[type=text], input[type=email] {
            width: calc(80vw - 3em);
        }

        .form-box h1 {
            font-size: 7vw;
        }

        .text-box .red-buttons {
            transform: scale(0.7);
        }
    }
</style>