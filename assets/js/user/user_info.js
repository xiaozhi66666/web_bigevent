$(function() {
    const form = layui.form;
    form.verify({
            nickname: (value) => {
                if (value.length > 8) return '昵称长度不可以超过8位'
            }
        })
        // 定义一个获取用户基本信息的方法
    const getUserInfo = () => {
            $.get({
                url: '/my/userinfo',
                success: res => {
                    const { data, status, message } = res;
                    if (status !== 0) return layer.msg(message, { icon: 2 });
                    layer.msg(message, { icon: 1 });
                    // 调用layui中提供的form表单提供的补充渲染表单内的input框中的值的功能
                    form.val('formUserInfo', data);
                }
            })
        }
        // 定义一个重置信息的方法
    const getUserInfoReset = () => {
            $.get({
                url: '/my/userinfo',
                success: res => {
                    const { data, status, message } = res;
                    if (status !== 0) return layer.msg('重置用户信息失败', { icon: 2 });
                    layer.msg('重置用户信息成功', { icon: 1 });
                    // 调用layui中提供的form表单提供的补充渲染表单内的input框中的值的功能
                    form.val('formUserInfo', data);
                }
            })
        }
        // 添加重置按钮功能
    $('#btnReset').click((e) => {
            // 阻止默认行为
            e.preventDefault();
            // layer.msg('重置信息成功！')
            //调用一遍上面定义好的重置方法getUserInfoReset()获取用户信息并渲染input框的方法
            getUserInfoReset()
        })
        // 监听表单提交事件
        // const userName = $('.layui-form [name=nickname]')
        // const userEmai = $('.layui-form [name=email]')

    $('.layui-form').submit(function(e) {
        // const userName1 = $('.layui-form [name=nickname]')
        // const userEmai1 = $('.layui-form [name=email]')
        // if (userName.val() === userName1.val() && userEmai.val() === userEmai1.val()) return layer.msg('资料未修改，无需提交')
        // console.log(value);
        //阻止默认提交行为
        e.preventDefault();
        // 将所需要的input框中的值利用jquery中提供的方法searize()来直接获取这个表单中所有带有name属性的input框中的值并用常量保存
        const data = $(this).serialize();
        console.log(data);
        // 添加判断，如果表单内容并没有发生任何修改则阻止提交
        // if (data === value) return '内容未修改，无需提交'
        // 发送post请求
        $.post({
            url: '/my/userinfo',
            data,
            success: res => {
                // 将所需要的数据status , message从回调函数中参数的res对象中解构出来
                const { status, message } = res;
                if (status !== 0) return layer.msg(message);
                layer.msg(message)
                    // 调用父级页面中的获取用户信息方法重新渲染，将左上角的个人信息模块重新渲染
                window.parent.getUserInfo()
            }
        })
    })
    getUserInfo()
})