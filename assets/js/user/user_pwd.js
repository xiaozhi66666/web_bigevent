$(function() {
    const form = layui.form;
    form.verify({
            //添加密码校验规则，通用所有的密码框
            pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
            // 校验新密码与旧密码是否相同
            samePwd: (value) => {
                if (value === $('.layui-form [name=oldPwd]').val()) {
                    return '新密码不能与旧密码相同'
                }
            },
            // 校验确认密码是否与新密码相同
            rePwd: (value) => {
                if (value !== $('.layui-form [name=newPwd]').val()) {
                    return '新密码和确认密码不相同'
                }
            }
        })
        // 更新密码
    $('.layui-form').submit(function(e) {
        e.preventDefault();
        const data = $(this).serialize();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data,
            success: res => {
                const { status, message } = res;
                if (status !== 0) return layer.msg(message);
                layer.msg(message + '即将2秒后跳转到登录页面', { icon: 1 })
                setTimeout(() => {
                    localStorage.removeItem('token');
                    window.parent.location.href = '/login.html'
                }, 2000)
            }
        })
    })
})