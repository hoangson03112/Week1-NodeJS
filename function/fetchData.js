const fetchData = async (url) => {
        const response = await fetch(url);
        return response.json();
}

const getPostWithCommentsById = (id) => {
        return Promise.all([
                fetchData("https://jsonplaceholder.typicode.com/posts/" + `${id}`),
                fetchData("https://jsonplaceholder.typicode.com/comments?postId=" + `${id}`)
        ]);
}
module.exports = { fetchData, getPostWithCommentsById };