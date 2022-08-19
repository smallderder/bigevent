$(function () {
  var form = layui.form
  var layer = layui.layer

  //  小眼睛系列
  $('.open').on('click', function () {
    $('.close').show()
    $('.pwd').attr('type', 'password')
    $(this).hide()
  })
  $('.close').on('click', function () {
    $('.open').show()

    $('.pwd').attr('type', 'text')
    $(this).hide()
  })
  $('.open1').on('click', function () {
    $('.close1').show()
    $('.pwd1').attr('type', 'password')
    $(this).hide()
  })
  $('.close1').on('click', function () {
    $('.open1').show()
    $('.pwd1').attr('type', 'text')

    $(this).hide()
  })
  $('.open2').on('click', function () {
    $('.close2').show()
    $('.pwd2').attr('type', 'password')
    $(this).hide()
  })
  $('.close2').on('click', function () {
    $('.open2').show()
    $('.pwd2').attr('type', 'text')

    $(this).hide()
  })

  //  去注册 按钮的点击事件
  $('#goReg a').on('click', function () {
    $('#login-page').hide()
    $('#reg-page').show()
  })
  $('#gologin a').on('click', function () {
    $('#login-page').show()
    $('#reg-page').hide()
  })


  // 自定义表单验证
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: function (value) {
      if (value !== $('#reg-page [name=password]').val()) {
        return '两次密码不一致'
      }
    }
  })

  // 监听 注册表单 的提交事件
  $('.form2').submit(function (e) {
    e.preventDefault()
    var data = { username: $('.form2 [name=username]').val(), password: $('.form2 [name=password]').val() }
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功')
      // 方法1
      // $('#login-page').show()
      // $('#reg-page').hide()
      // 方法2：
      $('#gologin a').click()
    })
  })

  // 监听登录表单的提交事件
  $('.form1').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      // url千万不要写成大写
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('登录成功')
        localStorage.setItem('token', res.token)
        location.href = '/index.html'
      }
    })
  })


})