var mongoose = require('mongoose')

var Schema = mongoose.Schema
var timestamps = require('mongoose-timestamp')
var mongoosePaginate = require('mongoose-paginate');

// Define User schema
var _Article = new Schema({
  id: Schema.Types.ObjectId,
  title: String,
  desc: String,
  author: String,
  content: String,
  url: String,
  image_list: Array,
  audio_zh: String,
  audio_zy: String,
  audio_en: String,
  vedio: String,
  cover_url: String,
  publish_date:{type: Date, default: Date.now},
  sort: { type: Number, default: 1 },
  deleted: {type: Boolean, default: false},
  type: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
})

_Article.plugin(timestamps)
_Article.plugin(mongoosePaginate)

// export them
module.exports = mongoose.model('Article', _Article)
