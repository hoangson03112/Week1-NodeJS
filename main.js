const fs= require('fs');
async function fetchDataFromMultipleAPIs() {
  try {
    //Get data from all users from API
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const dataUsser = await response.json();
    console.log("Data 10 user:", dataUsser);
    fs.writeFileSync('data/Data10User.json', JSON.stringify(dataUsser), 'utf-8');
    // Get all the posts and comments from the API
    const [dataPost, dataComment] = await Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/posts`).then((response) =>
        response.json()
      ),
      fetch(`https://jsonplaceholder.typicode.com/comments`).then((response) =>
        response.json()
      ),
    ]);
    console.log("Data posts:", dataPost);
    fs.writeFileSync('data/DataPosts.json', JSON.stringify(dataPost), 'utf-8');

    console.log("Data comments:", dataComment);
    fs.writeFileSync('data/DataComments.json', JSON.stringify(dataComment), 'utf-8');

    //----------------------------------------------------------------
    const newListUser = dataUsser.map((user) => {
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      };
    }); 
//---------------------------------------------------------------
    for (const user of newListUser) {
      async function fetchData() {
        const [getPostByUserId, getCommentByEmail] = await Promise.all([
          fetch(
            `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
          ).then((response) => response.json()),
          fetch(
            `https://jsonplaceholder.typicode.com/comments?email=${user.email}`
          ).then((response) => response.json()),
        ]);

        //map listComment
        const listComment = getCommentByEmail.map((comment) => {
          return {
            id: comment.id,
            postId: comment.postId,
            name: comment.name,
            body: comment.body,
          };
        });

        user.comment = listComment;
        //Map listPost
        const listPost = getPostByUserId.map((post) => {
          return {
            id: post.id,
            title: post.title,
            body: post.body,
          };
        });
        user.post = listPost;

        //add countPost và countComment
        user.postsCount = user.post.length;
        user.commentsCount = user.comment.length;

        //Executed when posts, comments,postCount,commentCount have been added for all users
        if (user.id === newListUser.length) {
            const dataMapPostAndComment=
            newListUser.map((user) => {
              return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                comment: user.comment,
                post: user.post,
              };
            })
    fs.writeFileSync('data/dataMapPostAndComment.json', JSON.stringify(dataMapPostAndComment), 'utf-8');
          
          //Users with more than 3 comments
          
            const dataUserMoreThan3Cm=
            newListUser.filter((user) => {
              return user.commentsCount > 3;
            })
    fs.writeFileSync('data/dataUserMoreThan3Cm.json', JSON.stringify(dataUserMoreThan3Cm), 'utf-8');
        
          const reformatDataWithCount=
            newListUser.map((user) => {
              return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                commentsCount: user.commentsCount,
                postsCount: user.postsCount,
              };
            })
    fs.writeFileSync('data/reformatDataWithCount.json', JSON.stringify(reformatDataWithCount), 'utf-8');
          
          let maxValue = -Infinity;
          let userMostPost;
          let userMostComment;

          // User with the most post
          newListUser.forEach((user) => {
            if (user.postsCount > maxValue) {
              maxValue = user.postsCount;
              userMostPost = user;
            }
          });
       
    fs.writeFileSync('data/userMostPost.json', JSON.stringify(userMostPost), 'utf-8');

          //User with the most comment
          maxValue = -Infinity;
          newListUser.forEach((user) => {
            if (user.commentsCount > maxValue) {
              maxValue = user.commentsCount;
              userMostComment = user;
            }
          });
        
    fs.writeFileSync('data/userMostComment.json', JSON.stringify(userMostComment), 'utf-8');

          //The postsCount value descending
          newListUser.sort((userPrev, userNext) => {
            return userNext.postsCount - userPrev.postsCount;
          });
        
    fs.writeFileSync('data/newListUser.json', JSON.stringify(newListUser), 'utf-8');
          

          //Get the post with ID of 1 via API request, at the same time get comments for post ID of 1 via another API request
          const [getPostId1, getCommentPostId1] = await Promise.all([
            fetch(`https://jsonplaceholder.typicode.com/posts/1`).then(
              (response) => response.json()
            ),
            fetch(
              `https://jsonplaceholder.typicode.com/comments?postId=1`
            ).then((response) => response.json()),
          ]);
          getPostId1.comments = getCommentPostId1;
         
    fs.writeFileSync('data/getPostId1.json', JSON.stringify(getPostId1), 'utf-8');

        }
      }
      fetchData();
    }
  } catch (error) {
    console.log(error);
  }
}

fetchDataFromMultipleAPIs();
