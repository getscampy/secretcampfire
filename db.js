(function() {
    const mongoose = require('mongoose');
    const normalizeUrl = require('normalize-url');

    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser:true }, function (error) {
      if (error) console.error(error);
      else console.log('DB connected');
    });

    const BlogSchema = new mongoose.Schema({
      id: String,
      name: String,
      description: String,
      avatar_url: String,
      header_url: String,
      style_url: String
    });

    const PostSchema = new mongoose.Schema({
      id: String,
      title: String,
      date: { type: Date, default: Date.now },
      thumbs: [String],
      urls: [String],
      text: String,
      tags: [String],
      post_url: String,
      re_url: String
    });
    Post = mongoose.model('Post', PostSchema);

    // collections:
    // - following
    // - reblogged_from
    const FollowSchema = new mongoose.Schema({
      id: String,
      date: { type: Date, default: Date.now },
      url_key: { type: String, unique: true },
      url: { type: String },
      name: String,
      notes: String
    });
    Follow = mongoose.model('Follow', FollowSchema);

    /*
     * blog
     */
    module.exports.updateInfo = function(info) {
    }

    /* 
     * post
     */
    module.exports.getPostSchema = function() {
      return PostSchema;
    }

    function _makeArray(x) {
      return Array.isArray(x)? x : [x];
    }
    module.exports.post = function(postData, cb) {
      try {
        // sanitize postData
        postData.thumb = _makeArray(postData.thumb);
        postData.url = _makeArray(postData.url);
        postData.tags = postData.tags.split(/(?:,| )+/);
        
        var newPost = new Post(postData);
        newPost.id = newPost._id;
        newPost.post_url = "/post/" + newPost.id

        newPost.save(function (err) {
          cb(err, newPost);
        });
      }
      catch(err) {
        cb(err, {});
      }
    }

    module.exports.reblog = function(post) {
    }

    module.exports.getPost = function(id, cb) {
      Post.findById(id, cb);
    }

    module.exports.update = function(id, keyVals) {
    }

    /* 
     * feed
     */

    module.exports.fetchPosts = function(index, cb) {
      try {
        if (index == 0)
          index = undefined;
        Post.find()
          .skip(index)
          .limit(10)
          .sort({'date': -1})
          .exec(cb);
      }
      catch(err) {
        cb(err, []);
      }
    }

    /*
     * networking
     */

    module.exports.follow = function(url, cb) {
      try {
        // normalize url to make url_key
        var urlKey = normalizeUrl(url, {
          stripHash: true,
          stripProtocol: true
        });
        
        var newFollow = new Follow({
          url_key: urlKey,
          url: url
        });
        newFollow.id = newFollow._id;

        newFollow.save(function (err) {
          cb(err, newFollow);
        });
      }
      catch(err) {
        cb(err, {});
      }
    }

    module.exports.getFollowing = function(blog) {
    }


}());
