<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm" label-position="top">

      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">

          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">发布
          </el-button>

        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>

      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
              <!-- <span v-show="postForm.title.length>=26" class='title-prompt'>app可能会显示不全</span> -->
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <!-- <el-col :span="8">
                  <el-form-item label-width="45px" label="作者:" class="postInfo-container-item">
                    <multiselect v-model="postForm.author" :options="userLIstOptions" @search-change="getRemoteUserList" placeholder="搜索用户" selectLabel="选择"
                      deselectLabel="删除" track-by="key" :internalSearch="false" label="key">
                      <span slot='noResult'>无结果</span>
                    </multiselect>
                  </el-form-item>
                </el-col> -->

                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="作者" placement="top">
                    <el-form-item label-width="100px" label="作者:" class="postInfo-container-item" prop="author">
                      <el-input placeholder="作者" style='min-width:150px;' v-model="postForm.author" >
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="$t('table.type')" prop ="type" >
                    <el-select class="filter-item" v-model="postForm.type" clearable placeholder="请选择">
                      <el-option v-for="item in  typeOptions" :key="item._id" :label="item.title" :value="item._id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="'发布时间(文章会按照发布时间排序)'" prop ="publish_date" >
                          <el-date-picker
                          v-model="postForm.publish_date"
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="8">
                  <el-form-item label-width="80px" label="发布时间:" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.display_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col> -->
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="100px" label="文章简介:" prop="content_short">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.content_short" >
          </el-input>
          <!-- <span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span> -->
        </el-form-item>


        <div style="margin-bottom: 20px;">
          <el-form-item label-width="100px" label="上传文章封面图片:" prop="cover_url">
          <UploadImage v-model="postForm.cover_url"></UploadImage>
          </el-form-item>
        </div>

        <div style="margin-bottom: 20px;">
          <el-form-item label-width="100px" label="上传视频介绍:" prop="vedio">
          <Upload v-model="postForm.vedio"></Upload>
          </el-form-item>
        </div>

        <div style="margin-bottom: 20px;">
          <el-form-item label-width="100px" label="上传汉语语音介绍:" prop="audio_zh">
          <Upload v-model="postForm.audio_zh"></Upload>
          </el-form-item>
        </div>

        <div style="margin-bottom: 20px;">
          <el-form-item label-width="100px" label="上传藏语语音介绍:" prop="audio_zy">
          <Upload v-model="postForm.audio_zy"></Upload>
          </el-form-item>
        </div>

        <div style="margin-bottom: 20px;">
          <el-form-item label-width="100px" label="上传英语语音介绍:" prop="audio_en">
          <Upload v-model="postForm.audio_en"></Upload>
          </el-form-item>
        </div>

        <div style="margin-bottom: 20px;">
          <el-form-item label-width="100px" label="上传图片库:" prop="image_list">
          <UploadImages v-model="postForm.image_list"></UploadImages>
          </el-form-item>
        </div>      


        <div class="editor-container">
          <el-form-item label-width="100px" label="文章正文:" prop="content">
          <tinymce :height="500" ref="editor" v-model="postForm.content"></tinymce>
          </el-form-item>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleFile'
import UploadImage from '@/components/Upload/singleImage3'
import UploadImages from '@/components/Upload/multiImages'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchArticle, createArticle, updateArticle } from '@/api/article'
import { fetchList as fetchCategory} from '@/api/category'
import { userSearch } from '@/api/remoteSearch'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  image_uri: '', // 文章图片
  cover_url:'',
  type: '',
  author: '',
  vedio: '',
  audio_en: '',
  audio_zh: '',
  audio_zy: '',
  image_list: [],
  publish_date: new Date(), // 前台展示时间
}

export default {
  name: 'articleDetail',
  components: { Tinymce, MDinput, Upload, UploadImage, Multiselect, Sticky, UploadImages },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: '内容未填写完整',
          type: 'error'
        })
        //callback(null)
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          //callback(null)
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      userLIstOptions: [],
      typeOptions: {},
      rules: {
        title: [{ required: true, validator: validateRequire }],
        author: [{ required: true, validator: validateRequire }],
        type: [{ required: true, validator: validateRequire }],
        content: [{ required: true, validator: validateRequire }],
        content_short: [{ required: true, validator: validateRequire }], 
        publish_date: [{ required: true, validator: validateRequire }]
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    }
  },
  created() {
      this.postForm = Object.assign({}, defaultForm)
      fetchCategory({limit:100, page:0}).then(response => {
        this.typeOptions = response.data.items;
        if (this.isEdit) {
          this.fetchData()
        } 
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })


  },
  methods: {
    fetchData() {
        fetchArticle({ id: this.$route.params.id }).then(response => {
          this.postForm.title = response.data.item.title
          this.postForm.image_uri = response.data.item.url
          this.postForm.content_short = response.data.item.desc
          this.postForm.content = response.data.item.content
          this.postForm.author = response.data.item.author
          this.postForm.type = response.data.item.type
          this.postForm.publish_date = response.data.item.publish_date
          this.postForm.cover_url = response.data.item.cover_url
          this.postForm.audio_zh = response.data.item.audio_zh
          this.postForm.audio_zy = response.data.item.audio_zy
          this.postForm.audio_en = response.data.item.audio_en
          this.postForm.vedio = response.data.item.vedio
          this.postForm.image_list = response.data.item.image_list
        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    },
    submitForm() {
      // this.postForm.display_time = parseInt(this.display_time / 1000)
      console.log(this.postForm)
      var self = this
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            const submitData = {
              'title': self.postForm.title,
              'desc': self.postForm.content_short,
              'url': self.postForm.image_uri,
              'id': this.$route.params.id,
              'content' : self.postForm.content,
              'author': self.postForm.author,
              'type': self.postForm.type,
              'publish_date':self.postForm.publish_date,
              'cover_url': self.postForm.cover_url,
              "audio_zh" : self.postForm.audio_zh,
              "audio_zy" : self.postForm.audio_zy,
              "audio_en" : self.postForm.audio_en,
              "vedio" : self.postForm.vedio,
              "image_list" : self.postForm.image_list
            }

            // add new article
            updateArticle(submitData).then(response => {
              if (response.data.error_code === 0) {
                this.$notify({
                  title: '成功',
                  message: '文章修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.postForm.status = 'published'
                this.$router.push({path: '/article/list'})
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                })
              }
              this.loading = false
            }).catch(err => {
              this.$message({
                message: '文章修改失败',
                type: 'warning'
              })
              this.loading = false
              console.log(err)
            })
          } else {
            const submitData = {
              'title': self.postForm.title,
              'desc': self.postForm.content_short,
              'url': self.postForm.image_uri,
              'content' : self.postForm.content,
              'author': self.postForm.author,
              'type': self.postForm.type,
              'publish_date': self.postForm.publish_date,
              'cover_url': self.postForm.cover_url,
              "audio_zh" : self.postForm.audio_zh,
              "audio_zy" : self.postForm.audio_zy,
              "audio_en" : self.postForm.audio_en,
              "vedio" : self.postForm.vedio,
              "image_list" : self.postForm.image_list
            }

            // add new article
            createArticle(submitData).then(response => {
              if (response.data.error_code === 0) {
                this.$notify({
                  title: '成功',
                  message: '文章创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.postForm.status = 'published'
                 this.$router.push({path: '/article/list'})
              } else {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                })
              }
              this.loading = false
            }).catch(err => {
              this.$message({
                message: '文章创建失败',
                type: 'warning'
              })
              this.loading = false
              console.log(err)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        console.log(response)
        this.userLIstOptions = response.data.items.map(v => ({
          key: v.name
        }))
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }

  label{
    text-align: left !important;
  }
</style>

