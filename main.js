const writeFile = require("./function/writeFile");
const { fetchData, getPostWithCommentsById } = require("./function/fetchData");
async function fetchDataFromMultipleAPIs() {
  try {
    //Get data from all users from API
    const dataUsser = await fetchData(
      "https://jsonplaceholder.typicode.com/users"
    );
    writeFile("data/Data10User.json", dataUsser);
    // Get all the posts and comments from the API
    const [dataPost, dataComment] = await Promise.all([
      fetchData(`https://jsonplaceholder.typicode.com/posts`),
      fetchData(`https://jsonplaceholder.typicode.com/comments`),
    ]);
    writeFile("data/DataPosts.json", dataPost);
    writeFile("data/DataComments.json", dataComment);

    const dataUsersMapWithPostsComments = dataUsser.map((user) => {
      const { address, company, ...newUser } = user;

      return {
        ...newUser,
        comments: dataComment.filter((comment) => comment.email === user.email),
        posts: dataPost.filter((post) => post.userId === user.id),
      };
    });
    writeFile(
      "data/dataUsersMapWithPAndCm.json",
      dataUsersMapWithPostsComments
    );

    const dataUserMoreThan3Cm = dataUsersMapWithPostsComments.filter((user) => {
      return user.comments.length > 3;
    });
    writeFile("data/dataUserMoreThan3Cm.json", dataUserMoreThan3Cm);

    const reformatDataWithCount = dataUsersMapWithPostsComments.map((user) => {
      const { comments, posts, ...rest } = user;
      return {
        ...rest,
        commentsCount: user.comments.length,
        postsCount: user.posts.length,
      };
    });
    writeFile("data/reformatDataWithCount.json", reformatDataWithCount);

    let maxValue = -1;
    let userMostPost;
    let userMostComment;

    // User with the most post
    reformatDataWithCount.forEach((user) => {
      if (user.postsCount > maxValue) {
        maxValue = user.postsCount;
        userMostPost = user;
      }
    });
    writeFile("data/userMostPost.json", userMostPost);

    //User with the most comment
    maxValue = -1;
    reformatDataWithCount.forEach((user) => {
      if (user.commentsCount > maxValue) {
        maxValue = user.commentsCount;
        userMostComment = user;
      }
    });
    writeFile("data/userMostComment.json", userMostComment);

    // The postsCount value descending
    reformatDataWithCount.sort((userPrev, userNext) => {
      return userNext.postsCount - userPrev.postsCount;
    });
    writeFile("data/listUserDescending.json", reformatDataWithCount);

    //Get the post with ID of 1 via API request, at the same time get comments for post ID of 1 via another API request
    writeFile("data/getPostById.json", await getPostWithCommentsById(1));
  } catch (error) {
    console.log(error);
  }
}

fetchDataFromMultipleAPIs();
