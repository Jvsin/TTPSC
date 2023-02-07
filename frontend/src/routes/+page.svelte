<script>
    import "../styles/global.css";
    import { onMount } from 'svelte';
    import { ethers } from "ethers";
    import Canvas from "../lib/Canvas.svelte";

    // Importing compiles files (artifacts and addresses)
    import Token_testArtifact from "../contracts/Token_test.json";
    import tokenAddress from "../contracts/token-address.json";
    import NotificationArtifact from "../contracts/Notifications.json";
    import notificationAddress from "../contracts/notification-address.json";
    import WorkersArtifact from "../contracts/AccountTypes.json";
    import workersAddress from "../contracts/workers-address.json";
    import MarketplaceArtifact from "../contracts/marketplace.json";
    import marketplaceAddress from "../contracts/marketplace-address.json";
    import KontraktArtifact from "../contracts/Main.json";
    import kontraktAddress from "../contracts/kontrakt-address.json";

    const HARDHAT_NETWORK_ID = "80001";
    const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

    export const initialState = {
        selectedAddress: undefined,
        _workers: undefined,
        _token: undefined,
        _provider: undefined
    }

    export const formValidation = {
        address: undefined,
        name: undefined,
        surname: undefined,
        email: undefined,
        role: undefined,
        statusMessage: ""
    }

    // Connecting user's wallet
    async function walletConnection(e) {
        e.preventDefault();
        if (window.ethereum === undefined) {
            console.log("ni mosz metomoska, trzo zoinstolowoć");
        } else {
            initialState.selectedAddress = await window.ethereum.request({ method: 'eth_requestAccounts' });

            if (initialState.selectedAddress) {
                console.log("connection: ", true);
                window.location.assign("./content");
            } else {
                console.log("connection: ", false);
            }
        }
    }

    async function initializeEthers() {
        initialState._provider = new ethers.providers.Web3Provider(window.ethereum);

        initialState._token = new ethers.Contract(
            tokenAddress.Token,
            Token_testArtifact.abi,
            initialState._provider.getSigner(0)
        );

        initialState._workers = new ethers.Contract(
            workersAddress.Workers,
            WorkersArtifact.abi,
            initialState._provider.getSigner(0)
        )
    }

    async function _addUser(e) {
        e.preventDefault();
        let {address, name, surname, email, role} = formValidation;
        if (!address || !name || !surname || !email || !role) {
            formValidation.statusMessage = "failed";
            console.log('Incomplete form: ', address, name, surname, email, Number(role));
        } else {
            await initialState._workers.addUser(address, name, surname, email, Number(role), {gasLimit: 540000});
            formValidation.statusMessage ="succeed";
        }
        // initialState._workers.addUser(address, name, surname, email, rank, {gasLimit: 540000});
        _GetAllUsers();
    }

    async function _GetAllUsers() {
        await initialState._workers.GetAllUsers().then((result) => {
            console.log(result)
        }).catch((err) => {
            console.log("code: ", err.code, "\nmessage: ", err.message);
        });
    }

    onMount(() => {
        initializeEthers();
        // _addUser('0x10405B8c49823F1f67307BC92589863a20CB8Eb5', 'ronald', 'frangulyan', 'ja@mail.com', 0);
        // _GetAllUsers();
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
                <button on:click={_addUser} type="button" class="form-item sign-up" name="sign-up">Register</button>
            </div>
            <div class="form-item">
                <p>{formValidation.statusMessage}</p>
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
        <a href="./content" on:click={walletConnection}>Connect Wallet</a>
    </div>
</div>
<Canvas />

<style>
    input[type=text], input[type=email], select {
        -moz-appearance:none;
        -webkit-appearance:none;
        appearance:unset;
        width: 300px;
        height: 40px;
        outline: none;
        border-radius: 10px;
        background: transparent;
        border: 1px solid rgb(255, 255, 255);
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        padding: 2px;
        letter-spacing: 1.5px;
        color: rgb(255, 255, 255);
        margin: 5px 0;
    }

    a {
        display: block;
        color: rgb(0, 0, 0);
        text-decoration: none;
        width: 250px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgb(234, 32, 39);
        border-radius: 30px;
        transition: 300ms ease-in-out;
        -webkit-tap-highlight-color: transparent;
    }

    a:hover {
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
        flex-flow: row-reverse wrap;
    }

    .container .form-box {
        width: 700px;
        height: 750px;
        border-radius: 30px;
        text-align: center;
        background: transparent;
        box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);
        border: solid 1px rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(9.6px);
        -webkit-backdrop-filter: blur(9.6px);
        color: rgb(255, 255, 255);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column wrap;
    }

    .form-box .form-item {
        margin: 20px 0
    }

    .form-box .pikabu {
        margin-top: 25px;
        text-align: center;
    }

    .container .text-box {
        width: 700px;
        height: 600px;
        text-align: center;
        color: rgb(255, 255, 255);
        letter-spacing: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column wrap;
    }

    .text-box * {
        margin: 40px 0;
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
        input[type=text], input[type=email] {
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
    }
</style>