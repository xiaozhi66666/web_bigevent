// - 在 `/assets/js` 目录中新建 `baseAPI.js`
// 介绍：jQuery.ajaxPrefilter()函数用于指定预先处理Ajax参数选项的回调函数。 （可以理解为请求拦截器了，在请求前做一些事件处理）
// 每次调用$.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用ajaxPrefilter()这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// - 调用 `$.ajaxPrefilter()` 函数，里面传递一个回调函数，回调函数里面有一个形成 `options`，这个形成里面就包含了这一次请求的相关信息
$.ajaxPrefilter((options) => {
    // console.log(options);
    // 在请求之前拼接上根路径，以便在发起请求的时候只需要携带上自己的路径就可以了
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // 注入token
    // 判断是否url中是否携带 '/my/'的文件
    if (options.url.includes('/my/')) {
        // 如果携带的话就设置上其的 headers属性值为 Authorization: localStorage.getItem('token')
        options.headers = {
            Authorization: localStorage.getItem('token') //token  令牌
        }
    }
    // 响应拦截器(在客户端接收到服务器传输回来的相应的时候)
    options.complete = res => {
        // console.log(res);
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        const { responseJSON } = res; // 利用对象解构将回调韩束complete中的参数res中的responseJSON提前解析出来
        if (responseJSON.status === 1 && responseJSON.message === '身份认证失败！') { //如果它的status值为1并且其message值为'身份认证失败！'
            // 1：先清除本地存储的token
            localStorage.removeItem('token')
                // 2：再将其网址跳转为登录页面的地址
            location.href = '/login.html'
        }
    }
});