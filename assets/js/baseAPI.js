// - 在 `/assets/js` 目录中新建 `baseAPI.js`
// - 调用 `$.ajaxPrefilter()` 函数，里面传递一个回调函数，回调函数里面有一个形成 `options`，这个形成里面就包含了这一次请求的相关信息
$.ajaxPrefilter((options) => {
    console.log(options);
    options.url = 'http://www.liulongbin.top:3007' + options.url;
});