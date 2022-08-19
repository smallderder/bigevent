
var layer = layui.layer
getUserInfo()


// 想要在子页面中调用父页面的方法时，父页面中的方法必须为全局的，所以不能写在立即执行函数中或者入口函数中
// 定义获取用户基本信息的方法
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败')
      }
      // console.log(res);
      // 渲染用户头像
      renderAvatar(res.data)
    },
    // ajax每次执行完成后，无论是否成功，都会执行complete中的函数
    // 因为每次执行ajax后都要用，所以写在baseAPI中
    // complete: function (res) {
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 强制清除token并强制跳转
    //     localStorage.removeItem('token')
    //     location.href = '/login.html'
    //   }
    // }
  })
}


// 定义渲染用户头像的函数
function renderAvatar(user) {
  var name = user.nickname || user.username
  $('.avatar span').html('欢迎&nbsp;&nbsp;' + name)
  // 渲染图片头像
  if (user.user_pic !== null) {
    $('.layui-nav-img')
      .attr('src', user.user_pic)
      .show()
    $('.text-avatar').hide()
  } else {
    // 渲染文字头像
    var first = name.substring(0, 1).toUpperCase()
    $('.text-avatar').html(first).show()
    $('.layui-nav-img').hide()
  }
}


// 实现退出
$('.logout').on('click', function () {
  localStorage.removeItem('token')
})


