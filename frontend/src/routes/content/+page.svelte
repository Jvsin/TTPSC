<script>
    import { onMount } from 'svelte';
    import { ethers } from "ethers";

    // Importing compiled files (artifacts and addresses but in this case only one becauce it inherits all the functionality of the rest)
    import KontraktArtifact from "../../contracts/Main.json";
    import kontraktAddress from "../../contracts/kontrakt-address.json";

    // Importing content from lib components
    import Take from '../../lib/Take.svelte';
    import Manage from '../../lib/Manage.svelte';
    import Give from '../../lib/Give.svelte';

    // This object stores information regarding the blockchain
    export const initialState = {
        selectedAddress: undefined,
        accountsArray: undefined,
        _kontrakt: undefined,
        _provider: undefined
    }

    export const renderingContent = {
        componentID: undefined
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
    }

    onMount(() => {
        initializeEthers();
    })

</script>

<div class="container">
    <div class="container-menu">
        <button on:click={() => renderingContent.componentID = 1} class="menu-take btn">Take</button>
        <button on:click={() => renderingContent.componentID = 2} class="menu-manage btn">Manage</button>
        <button on:click={() => renderingContent.componentID = 3} class="menu-give btn">Give</button>
    </div>
    <div class="container-content">
        {#if renderingContent.componentID === 1}
            <Take />
        {:else if renderingContent.componentID === 2}
            <Manage />
        {:else if renderingContent.componentID === 3}
            <Give />
        {/if}
    </div>
</div>

<style>
    .container {
        width: 90vw;
        height: auto;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
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
        height: 830px;
        padding: 20px;
        border-radius: 20px;
        margin: 25px 0 0 0;
        background: #2f3640;
        margin-bottom: 30px;
        overflow-y: scroll;
    }

    .container .container-content::-webkit-scrollbar {
        width: 8px;
        border-radius: 100px;
    }

    .container .container-content::-webkit-scrollbar-thumb {
        background-color: rgb(234, 32, 39);
        outline: none;
        border-radius: 50px;
    }
</style>