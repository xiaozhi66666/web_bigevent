$(function() {
    $('#link_reg').on('click', () => {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_login').on('click', () => {
        $('.login-box').show();
        $('.reg-box').hide();
    });
    // 先引入form 来自于layui
    const form = layui.form;
    // 自定义校验规则
    form.verify({
            // 数组方式
            pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
            // 函数方式
            repwd: (value) => {
                // 先获取到密码框的值
                const pwd = $('.reg-box [name=password]').val();
                // 测试是否获取到密码输入框的值
                // console.log(pwd, value);
                // 判断确认密码框中的值是否与输入密码框的值是否一致
                if (pwd !== value) return "搞仔细点，两次密码不一致"
            }
        })
        // const baseUrl = "http://www.liulongbin.top:3007";
        // 监听表单提交事件，发送注册请求
    $('#form_reg').submit((e) => {
            // 阻止表单的默认提交事件
            e.preventDefault();
            // 发送ajax请求
            $.ajax({
                // 先设定请求类型为post
                type: 'POST',
                // 设置请求路径
                url: '/api/reguser',
                // 发送请求所需要携带的内容
                data: $('#form_reg').serialize(),
                // username: $('#form_reg [name=username]').val(),
                // password: $('#form_reg [name=password]').val()

                // 发送请求后的回调函数
                success: (res) => {
                    // 测试回调结果
                    console.log(res);
                    if (res.status !== 0) return layer.msg(res.message);
                    layer.msg("恭喜你，注册成功！")
                        // 自动触发点击事件，点击登录跳转到登录页面
                    $('#link_login').click();
                }
            })
        })
        // 监听表单提交事件，发送登录请求
    $('#form_login').submit(function(e) {
        console.log($(this).serialize());
        // 阻止默认提交事件
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: res => {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message)
                    // 1:将登录成功后返回的token保存到本地locastorage
                localStorage.setItem('token', res.token)
                    // 2:跳转到首页index.html
                    // location.href = '/index.html'
            }
        })
    })
})