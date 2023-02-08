<script>
    import { onMount } from 'svelte';
    import { ethers } from "ethers";

    import KontraktArtifact from "../../contracts/Main.json";
    import kontraktAddress from "../../contracts/kontrakt-address.json";

    // This object stores information regarding the blockchain
    export const initialState = {
        selectedAddress: undefined,
        _kontrakt: undefined,
        _provider: undefined
    }

    // Initializing contracts (in this case only one becauce it inherits all the functionality of the rest)
    async function initializeEthers() {
        initialState._provider = new ethers.providers.Web3Provider(window.ethereum);

        initialState._kontrakt = new ethers.Contract(
            kontraktAddress.Kontrakt,
            KontraktArtifact.abi,
            initialState._provider.getSigner(0)
        );
    }

    async function _GetAllUsers() {
        await initialState._kontrakt.GetAllUsers().then((result) => {
            console.log(result)
        }).catch((err) => {
            console.log("code: ", err.code, "\nmessage: ", err.message);
        });
    }

    onMount(() => {
        initializeEthers();
        _GetAllUsers();
    })

</script>

<div class="container">
    <div class="container-menu">
        <button class="menu-take btn">Take</button>
        <button class="menu-modify btn">Modify</button>
        <button class="menu-give btn">Give</button>
    </div>
    <div class="container-content">
        
    </div>
</div>

<style>
    .container {
        width: 90vw;
        height: auto;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-flow: column;
    }

    .container .container-menu {
        width: 90vw;
        height: auto;
        display: flex;
        justify-content: space-around;
        flex-flow: row wrap;
    }

    .container-menu * {
        margin: 10px 0;
    }

    .container .container-content {
        width: 90vw;
        height: 600px;
        border-radius: 30px;
        margin: 25px 0 0 0;
        background: #2f3640;
        display: flex;
        justify-content: start;
        align-items: flex-start;
        margin-bottom: 30px;
    }
</style>