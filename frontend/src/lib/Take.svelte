<script>

</script>

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
</div>

<style>
    .content-take {
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
        position: relative;
        top: 0;
    }

    .content-take .item:hover {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.664), 0 6px 6px rgba(0, 0, 0, 0.589);
        top: -10px;
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
</style>