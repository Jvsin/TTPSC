<script>
    import "../styles/global.css";
    import Canvas from "../lib/Canvas.svelte";
</script>

<div class="container">
    <div class="form-box">
        <form action="">
            <h1 class="form-iten">User Registration</h1>

            <div class="form-item input-email">
                <label for="email">Email</label><br>
                <input type="email" name="">
            </div>
            <div class="form-item input-password">
                <label for="password">Password</label><br>
                <input type="password" name="">
            </div>
            <div class="form-item buttons">
                <button type="submit" class="form-item sign-up" name="sign-up">Register</button>
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
        <a href="./content">Connect Wallet</a>
    </div>
</div>
<Canvas />

<style>
    input {
        width: 325px;
        height: 40px;
        outline: none;
        background: transparent;
        border: 1px solid rgb(255, 255, 255);
        text-align: center;
        font-size: 18px;
        font-weight: 900;
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
        height: 600px;
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
        margin-top: 50px;
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
            padding: 50px 0;
        }

        .container .form-box {
            width: calc(100vw - 35px);
        }

        .text-box h1 {
            font-size: 8vw;
        }

        .text-box p {
            font-size: 13px;
        }
    }

    @media only screen and (max-width: 800px) {
        input {
            width: calc(100% - 30px);
        }

        .container {
            height: 100vh;
            padding: 0;
        }
    }
</style>