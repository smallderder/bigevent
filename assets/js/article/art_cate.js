$(function () {
  var layer = layui.layer
  var form = layui.form
  getCate()


  // 定义获取列表信息的方法
  function getCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 通过 template 模板引擎渲染页面
        var htmlStr = template('tplCate', res)
        $('tbody').html(htmlStr)
      }
    })
  }
  var indexAdd = null
  // 给 添加类别 按钮绑定点击事件
  $('#btnAdd').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px'],
      title: '添加文章类别',
      content: $('#tplAdd').html()
    });
  })

  // 因为 弹出层是动态添加的，所以要用事件委托
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: {
        name: $('#form-add [name=name]').val(),
        alias: $('#form-add [name=alias]').val()
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('新增分类成功')
        layer.close(indexAdd)
        getCate()
      }
    })
  })

  var indexedit = null
  // 给 编辑 按钮绑定点击事件（动态添加，事件委托）
  $('tbody').on('click', '#btnEdit', function () {
    var id = $(this).attr('data-id')
    indexedit = layer.open({
      type: 1,
      area: ['500px'],
      title: '修改文章类别',
      content: $('#tplEdit').html()
    }),
      $.ajax({
        method: 'GET',
        url: '/my/article/cates/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          // 填充表单数据
          form.val('form-edit', res.data)
        }
      })
  })

  // 给 表单 绑定提交事件 (事件委托)
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.close(indexedit)
        getCate()
      }
    })
  })


  // 给 删除 按钮添加点击事件 （事件委托）
  $('tbody').on('click', '#btnDel', function () {
    var id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          getCate()
          layer.close(index);
        }
      })
    });
  })











})