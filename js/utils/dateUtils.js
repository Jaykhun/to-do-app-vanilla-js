const sortDate = (date) => {
    console.log(date);
    const data = date.split('-')
    return new Date(data[0], data[1] - 1, data[2])
}

export { sortDate }
