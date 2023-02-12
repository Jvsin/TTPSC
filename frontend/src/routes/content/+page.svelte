<script>
    import { onMount } from 'svelte';
    import { ethers } from "ethers";

    // Importing compiled files (artifacts and addresses but in this case only one becauce it inherits all the functionality of the rest)
    import KontraktArtifact from "../../contracts/Kontrakt.json";
    import kontraktAddress from "../../contracts/kontrakt-address.json";

    // Importing content from lib components
    import Buy from '../../lib/Buy.svelte';
    import Manage from '../../lib/Manage.svelte';
    import Give from '../../lib/Give.svelte';
    import Take from '../../lib/Take.svelte';

    // This object stores information regarding the blockchain
    export const initialState = {
        selectedAddress: undefined,
        _kontrakt: undefined,
        _provider: undefined
    }

    // This object stores information regarding contents
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
        <button on:click={() => renderingContent.componentID = 1} class="menu-buy btn">Buy</button>
        <button on:click={() => renderingContent.componentID = 2} class="menu-manage btn">Manage</button>
        <button on:click={() => renderingContent.componentID = 3} class="menu-give btn">Give</button>
        <button on:click={() => renderingContent.componentID = 4} class="menu-take btn">Take</button>
    </div>
    <div class="container-content">
        {#if renderingContent.componentID === 1}
            <Buy />
        {:else if renderingContent.componentID === 2}
            <Manage />
        {:else if renderingContent.componentID === 3}
            <Give />
        {:else if renderingContent.componentID === 4}
            <Take />
        {/if}
    </div>
</div>

<style>
    .container {
        width: 80vw;
        height: auto;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
    }

    .container .container-menu {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: space-around;
        flex-flow: row wrap;
    }

    .container-menu * {
        margin: 10px 0;
    }

    .container .container-content {
        width: 100%;
        height: auto;
        padding: 10px 0;
        border-radius: 20px;
        margin: 50px 0 0 0;
        /* background: #2f3640; */
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

    @media only screen and (max-width: 760px) {
        .container {
            width: 100vw;
        }
    }
</style>