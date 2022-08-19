$(function () {
  var layer = layui.layer
  var form = layui.form

  // 昵称验证
  form.verify = ({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称必须在1-6个字符之内！'
      }
    }
  })
  getUsername()

  function getUsername() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // form.val()快速为表单赋值
        form.val('formUserInfo', res.data)
        console.log(res);
      }
    })
  }

  // 监听 表单 的提交行为
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      // 必须有id隐藏于的原因是 文档规定更新用户信息时，必须提交id的值
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改用户信息失败')
        }
        // console.log(res);
        layer.msg('修改用户信息成功')
        // 同步修改 欢迎语 和 头像，调用父页面中的方法
        console.log(window.parent);
        window.parent.getUserInfo()

      }
    })
  })

  // 给 reset 按钮添加点击事件
  $('[type=reset]').on('click', function (e) {
    e.preventDefault()
    getUsername()
  })

})