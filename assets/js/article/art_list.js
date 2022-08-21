$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage;

  // 定义q参数对象
  var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: ''
  }
  getArtCate()
  getArtList()
  // 定义时间过滤器
  template.defaults.imports.dateFormat = function (date) {
    var dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
  // 定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

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
  // 定义获取文章列表数据的方法
  function getArtList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 调用template
        let htmlStr = template('tplRender', res)
        $('tbody').html(htmlStr)
        layer.msg(res.message)
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }
  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用laypage.render方法,渲染分页
    laypage.render({
      elem: 'pageBox',   //分页容器的id
      count: total,      //总数居条数
      limit: q.pagesize, //每页显示几条数据
      curr: q.pagenum,   //默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候,触发jump回调
      // 触发jump回调的方式有两种
      // 1.切换页码
      // 2.调用 laypage.render方法 的时候
      jump: function (obj, first) {
        // 通过 first 的值来判断,是通过哪种方式触发的jump
        // 若 点击触发，则first的值为undefined
        // 若 调用 触发，则first的值为true
        // console.log(obj.curr);
        // console.log(first);
        // 把最新的页码值,赋值给q这个查询参数对象中
        q.pagenum = obj.curr
        // 把最新的条目数 赋值给q这个查询参数对象
        q.pagesize = obj.limit
        if (!first) {
          getArtList()
        }
      }
    })
  }


  // 监听表单的提交事件
  $('#form-select').on('submit', function (e) {
    e.preventDefault()
    q.cate_id = $('#cate').val()
    q.state = $('[name=state]').val()
    getArtList()
  })

  // 事件委托，给编辑按钮绑定点击事件
  $('tbody').on('click', '#btnEdit', function () {
    var id = $(this).attr('data-id')
    location.href = '/article/art_change.html?id=' + id
  })



  //事件委托，给删除按钮绑定点击事件
  $('tbody').on('click', '#btnDel', function () {
    var id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/delete/' + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        getArtList()
      }
    })
  })
})