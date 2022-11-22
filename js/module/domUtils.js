const addClass = (e, addCLass) => e.forEach(item => item.classList.add(addCLass));

const removeClass = (e, removeCLass) => e.forEach(item => item.classList.remove(removeCLass));

const createElement = (type, block, value) => {
    const item = document.createElement(type);
    item.innerHTML = value;
    block.append(item);
    return item
}

export { removeClass, addClass, createElement }