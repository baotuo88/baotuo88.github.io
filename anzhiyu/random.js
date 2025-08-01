var posts=["2025/08/01/hello-world/","2025/08/01/python学习/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };