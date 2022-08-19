$(function () {
  var form = layui.form

  // 验证两次密码是否一致
  form.verify({
    repwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码不一致'
      }
    }
  })

  //  监听表单的提交事件
  $('form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: {
        oldPwd: $('[name=oldPwd]').val(),
        newPwd: $('[name=newPwd]').val()
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        localStorage.removeItem('token')
        window.parent.location.href = '/login.html'
      }
    })

  })








})