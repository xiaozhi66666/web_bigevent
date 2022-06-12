// 定义一个获取用户基本信息的方法（这里不可以用入口函数）
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: res => {
            const { status, message, data } = res
            if (status !== 0) return layer.msg(message)
            layer.msg(message)
                // 将res.data作为参数传入渲染用户信息的方法中进行调用
            renderAvatar(data)
                // console.log(res.data);
        },
        // complete: res => {
        //     // console.log(res);
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     const { responseJSON } = res; // 利用对象解构将回调韩束complete中的参数res中的responseJSON提前解析出来
        //     if (responseJSON.status === 1 && responseJSON.message === '身份认证失败！') { //如果它的status值为1并且其message值为'身份认证失败！'
        //         // 1：先清除本地存储的token
        //         localStorage.removeItem('token')
        //             // 2：再将其网址跳转为登录页面的地址
        //         location.href = '/login.html'
        //     }
        // }

    })
}
// 定义一个渲染用户信息的函数
const renderAvatar = (user) => {
        // 获取用户的昵称（判断是否有昵称）
        const name = user.nickname || user.username
            // 渲染欢迎语
        $('#welcome').html(`欢迎  ${name}`)
            // 添加判断条件，如果获取到的用户信息中的user_pic属性值不为空，则给用户头像盒子的src属性更改为返回数据中的 user.user_(src)
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user_pic);
            $('.text-avatar').hide()
        } else {
            $('.layui-nav-img').hide();
            let first = name[0].toUpperCase();
            $('.text-avatar').html(first).show();
        }
    }
    // 退出登录
$('#signOut').click(() => {
    // 引入layui的弹出层中的询问框的样式，并且附带回调函数
    layer.confirm('是否确定退出登录?', { icon: 3, title: '提示' }, function(index) {
        // layer.close(index);
        // 1:清空本地存储的token
        localStorage.removeItem('token');
        // 2:跳转到登录页面
        location.href = '/login.html'
    });
});
// 定义一个切换高亮的方法
function changeLight() {
    $('#artList').addClass('layui-this').next().removeClass('layui-this')
}
// 调用获取用户基本信息的方法
getUserInfo()