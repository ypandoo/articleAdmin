var express = require('express')
var router = express.Router()
var Article = require('../models/article')

router.post('/add', function(req, res) {

  const url = req.body.url

  const desc = req.body.desc
  if (!desc) {
    res.json({ error_code: 1, msg: 'desc is empty' })
    return
  }
  const title = req.body.title
  if (!title) {
    res.json({ error_code: 1, msg: 'title is empty' })
    return
  }
  const content = req.body.content
  if (!content) {
    res.json({ error_code: 1, msg: 'content is empty' })
    return
  }
  const type = req.body.type
  if (!type) {
    res.json({ error_code: 1, msg: 'type is empty' })
    return
  }

  var article = new Article({
    title: title,
    desc: desc,
    url: url,
    type: type,
    content: content
  })
  article.save(function(err, docs) {
    if (!err) {
      res.json({ error_code: 0, msg: 'success' })
    } else {
      res.json({ error_code: 1, msg: 'query article failed', data: {}})
    }
  })
  //res.json({ error_code: 0, msg: 'success' })
})

router.post('/update', function(req, res) {
  const id = req.body.id
  if (!id) {
    res.json({ error_code: 1, msg: 'id is empty' })
    return
  }
  const url = req.body.url
  if (!url) {
    res.json({ error_code: 1, msg: 'url is empty' })
    return
  }
  const desc = req.body.desc
  if (!desc) {
    res.json({ error_code: 1, msg: 'desc is empty' })
    return
  }
  const title = req.body.title
  if (!title) {
    res.json({ error_code: 1, msg: 'title is empty' })
    return
  }
  const type = req.body.type
  if (!type) {
    res.json({ error_code: 1, msg: 'type is empty' })
    return
  }
  const content = req.body.content
  if (!content) {
    res.json({ error_code: 1, msg: 'content is empty' })
    return
  }
  const author = req.body.author
  if (!author) {
    res.json({ error_code: 1, msg: 'author is empty' })
    return
  }

  Article.findOneAndUpdate({ _id: id }, {
    title: title,
    desc: desc,
    url: url,
    content: content,
    author: author,
    type: type
  }, function(err, docs) {
    if (!err) {
      res.json({ error_code: 0, msg: 'success' })
    } else {
      res.json({ error_code: 1, msg: 'query article failed', data: {}})
    }
  })
})

router.post('/list', function(req, res) {
  var limit = req.body.limit
  if (!limit) {
    limit = 20
  }
  var page = req.body.page
  if (!page) {
    page = 1
  }

  var type = req.body.type
  var query = {};
  if(typeof type != 'undefined' && type != ""){
    Object.assign(query, {type: type});
  }

  var options = {
    populate: 'type',
    page: page, 
    limit: limit
  };

  Article.paginate(query, options, function(err, docs) {
    if (!err) {
      res.json({ error_code: 0, msg: 'success', items: docs.docs, total: docs.total, page: docs.page, pages: docs.pages })
    } else {
      res.json({ error_code: 1, msg: 'query article failed', data: {}})
    }
  })
})

router.post('/findOne', function(req, res) {
  const id = req.body.id
  if (!id) {
    res.json({ error_code: 1, msg: 'id is empty' })
    return
  }
  Article.findOne({ _id: id }, function(err, item) {
    if (!err) {
      res.json({ error_code: 0, msg: 'success', item: item })
    } else {
      res.json({ error_code: 1, msg: 'query one article failed', item: {}})
    }
  })
})

module.exports = router
