<script>
    import { onMount } from 'svelte';
    import { ethers } from "ethers";

    import KontraktArtifact from "../../contracts/Main.json";
    import kontraktAddress from "../../contracts/kontrakt-address.json";

    // This object stores information regarding the blockchain
    export const initialState = {
        selectedAddress: undefined,
        accountsArray: undefined,
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

    async function _getAllUsers() {
        await initialState._kontrakt.getAllUsers().then((result) => {
            console.log(result)
        }).catch((err) => {
            console.log("code: ", err.code, "\nmessage: ", err.message);
        });
    }

    onMount(() => {
        initializeEthers();
        _getAllUsers();
    })

</script>

<div class="container">
    <div class="container-menu">
        <button class="menu-take btn">Take</button>
        <button class="menu-modify btn">Modify</button>
        <button class="menu-give btn">Give</button>
    </div>
    <div class="container-content">
        <div class="content-take">
            <div class="item">
                <div class="item-desc">
                    <p>dlugopis</p>
                </div>
                <div class="item-interact">
                    <button class="small-red-btn">Buy</button>
                    <p>Price: </p>
                </div>
            </div>
            <div class="item">
                <div class="item-desc">
                    <p>dlugopis</p>
                </div>
                <div class="item-interact">
                    <button class="small-red-btn">Buy</button>
                    <p>Price: </p>
                </div>
            </div>
            <div class="item">
                <div class="item-desc">
                    <p>dlugopis</p>
                </div>
                <div class="item-interact">
                    <button class="small-red-btn">Buy</button>
                    <p>Price: </p>
                </div>
            </div>
            <div class="item">
                <div class="item-desc">
                    <p>dlugopis</p>
                </div>
                <div class="item-interact">
                    <button class="small-red-btn">Buy</button>
                    <p>Price: </p>
                </div>
            </div>
            <div class="item">
                <div class="item-desc">
                    <p>dlugopis</p>
                </div>
                <div class="item-interact">
                    <button class="small-red-btn">Buy</button>
                    <p>Price: </p>
                </div>
            </div>
            <div class="item">
                <div class="item-desc">
                    <p>dlugopis</p>
                </div>
                <div class="item-interact">
                    <button class="small-red-btn">Buy</button>
                    <p>Price: </p>
                </div>
            </div>
            <div class="item">
                <div class="item-desc">
                    <p>dlugopis</p>
                </div>
                <div class="item-interact">
                    <button class="small-red-btn">Buy</button>
                    <p>Price: </p>
                </div>
            </div>
            <div class="item">
                <div class="item-desc">
                    <p>dlugopis</p>
                </div>
                <div class="item-interact">
                    <button class="small-red-btn">Buy</button>
                    <p>Price: </p>
                </div>
            </div>
            <div class="item">
                <div class="item-desc">
                    <p>dlugopis</p>
                </div>
                <div class="item-interact">
                    <button class="small-red-btn">Buy</button>
                    <p>Price: </p>
                </div>
            </div>
        </div>
        <div class="content-modify"></div>
        <div class="content-give"></div>
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

    /* Take */
    .container-content .content-take {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-flow: row wrap;
    }

    .content-take .item {
        width: 245px;
        height: 210px;
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
    }

    .content-take .item:hover {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.664), 0 6px 6px rgba(0, 0, 0, 0.589);
        margin-top: -1.5px;
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
    /* Take */
    
    .container-content .content-modify {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column wrap;
        border: solid 1px rgb(255, 255, 255);
        display: none;
    }

    .container-content .content-give {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column wrap;
        border: solid 1px rgb(255, 255, 255);
        display: none;
    }
</style>