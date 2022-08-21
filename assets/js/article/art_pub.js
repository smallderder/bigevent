$(function () {
  var form = layui.form
  var layer = layui.layer
  getArtCate()
  // 初始化富文本编辑器
  initEditor()

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 给 选择封面 按钮添加点击事件
  $('#cover').on('click', function () {
    $('#file').click()
  })

  // 获取文章分类数据的方法
  function getArtCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 调用模板引擎 渲染数据到option中
        var htmlStr = template('tplList', res)
        $('#cate').html(htmlStr)
        // option 的渲染最后要调用 form.render（）重新渲染
        form.render()
      }
    })
  }

  // 监听 file 的change事件
  $('#file').on('change', function (e) {
    var file = e.target.files[0]
    if (e.target.files.length = 0) {
      return layer.msg('请选择文件后再上传')
    }
    var newImgURL = URL.createObjectURL(file)
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  var artState = '已发布'
  // 给 存为草稿按钮 绑定点击事件
  $('#btnDraf').on('click', function () {
    artState = '草稿'
  })

  // 给表单绑定提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    // 基于 form 表单，快速创建formdate对象,只有dom元素才有formdate方法
    var fd = new FormData($(this)[0])
    fd.append('state', artState)

    // 将裁剪后的图片输出为文件
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append('cover_img', blob)
        publish(fd)
      })

    // 循环遍历fd 打印里面的键值对
    fd.forEach(function (v, k) {
      console.log(k, v);
    })
  })


  // 定义发布文章的方法
  function publish(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 如果发送的是 fd格式的数据，一定要配置以下两项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败')
        }
        layer.msg('发布文章成功')
        location.href = '/article/art_list.html'
      }

    })
  }

})