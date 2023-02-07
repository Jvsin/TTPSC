<script>

</script>

<div class="container">
    <div class="container-menu">
        <button class="menu-take">Take</button>
        <button class="menu-modify">Modify</button>
        <button class="menu-give">Give</button>
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