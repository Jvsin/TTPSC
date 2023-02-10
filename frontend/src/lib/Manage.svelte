<script>

</script>

<div class="content-manage">
    <div class="manage-notifications">
        <h1>Notifications</h1>

        <div class="notifications-box">
            <div class="notification">
                <div class="btns">
                    <button class="btn-approve"></button>
                    <button class="btn-reject"></button>
                </div>
                <div class="text"></div>
            </div>

            <div class="notification">
                <div class="btns">
                    <button class="btn-approve"></button>
                    <button class="btn-reject"></button>
                </div>
                <div class="text"></div>
            </div>
            <div class="notification">
                <div class="btns">
                    <button class="btn-approve"></button>
                    <button class="btn-reject"></button>
                </div>
                <div class="text"></div>
            </div>
        </div>
    </div>

    <div class="manage-items">
        <form action="">
            <h1 class="form-item">Create new item</h1>

            <div class="form-item input-name">
                <label for="name">Name</label><br>
                <input required type="text" name="name">
            </div>
            <div class="form-item input-price">
                <label for="price">Price</label><br>
                <input required type="number" name="price" min="1">
            </div>
            <div class="form-item buttons">
                <button type="button" class="form-item btn" name="send">Add</button>
            </div>
            <div class="form-item">
                <p></p>
            </div>
        </form>
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
        color: rgb(255, 255, 255);
    }

    .manage-notifications h1 {
        margin: 30px 0;
    }

    .manage-notifications .notifications-box {
        width: 100%;
        height: 650px;
        border-radius: 20px;
        background: rgb(20, 22, 26);
        flex-flow: column;
        overflow-y: scroll;
    }

    .manage-notifications .notifications-box::-webkit-scrollbar {
        width: 3px;
        border-radius: 100px;
    }

    .manage-notifications .notifications-box::-webkit-scrollbar-thumb {
        background-color: rgb(234, 32, 39);
        outline: none;
        border-radius: 50px;
    }

    .notifications-box .notification {
        width: 95%;
        height: 150px;
        margin: 20px auto;
        border-radius: 20px;
        background: white;
    }

    .notification .btns {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: end;
        align-items: center;
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
    }

    .btns button:hover {
        background: rgba(55, 55, 55, 0.8);;
    }
     /* Notification content */

    form {
        width: 500px;
        height: 100%;
        text-align: center;
        border-radius: 20px;
        color: rgb(255, 255, 255);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column wrap;
    }

    form .form-item {
        margin: 15px 0;
    }
</style>