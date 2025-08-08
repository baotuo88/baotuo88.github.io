var posts=["2025/08/06/Apple ID/","2025/08/08/hello-world/","2025/08/03/面板功能介绍/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };