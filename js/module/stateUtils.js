const redirectToPage = (page) => {
    setTimeout(() => {
        window.location.href = `${page}.html`;
    }, 0);
}

const showMessage = (message) => alert(message);

const showState = (message) => {
    let wrap = document.querySelector('#status-message');
    let block = document.createElement('div');
    wrap.append(block);
    block.innerHTML = message;
    block.style.cssText = `
       position: fixed;
       text-align: center;
       min-width: 150px;
       max-width: 200px;
       padding: 10px;
       bottom: 35px;
       right: -300px;
       background: #fff;
       font-size: 18px;
       color:  #4ec2e7;
       z-index: 3;
       transition: 0.5s all linear;
       box-shadow: 0 0 5px 0 rgb(160, 159, 159);
       font-family: Arial, Helvetica, sans-serif;
    `;

    setTimeout(() => {
        block.style.right = '30px';
    }, 300);

    setTimeout(() => {
        block.style.right = '-300px';
    }, 2200);

    setTimeout(() => {
        block.remove();
    }, 2500);
}

export {
    redirectToPage,
    showMessage,
    showState
}