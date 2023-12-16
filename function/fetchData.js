const fetchData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const getPostAndCommentsById =async (id) => {
  const [post, comment] =await Promise.all([
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
module.exports = { fetchData, getPostAndCommentsById };
