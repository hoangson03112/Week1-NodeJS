const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const getPostWithCommentsById = (id) => {
  const [post, comment] = Promise.all([
    fetchData("https://jsonplaceholder.typicode.com/posts/"+`${id}`),
    fetchData(
      "https://jsonplaceholder.typicode.com/comments?postId="+`${id}`
    )
  ]);

  return {
    ...post,
    comments: comment,
  };
};
module.exports = { fetchData, getPostWithCommentsById };
