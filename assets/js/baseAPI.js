
// 每次发起ajax请求之前都会 调用这个函数
$.ajaxPrefilter(function (options) {
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  // 判断请求地址是否含有/my/
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      authorization: localStorage.getItem('token') || ''
    }
  }
  options.complete = function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 强制清除token并强制跳转
      localStorage.removeItem('token')
      location.href = '/login.html'
    }
  }
})


