// just a to test jest
const dummy = (blogs) => {
    return 1;
}

// count up all the likes
const totalLikes = (blogs) => {
    let total = blogs.reduce((previous, now) => {
        return previous + now.likes
    }, 0)
    return total 
}

const favoriteBlogs = (blogs) => {

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlogs
}