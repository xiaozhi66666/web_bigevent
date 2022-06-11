$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
        // 模拟点击上传文件
    $('#upload').click(() => {
            $('#files').click()
        })
        //监听改变事件
    $('#files').change((e) => {
        const fileLength = e.target.files.length;
        if (fileLength === 0) return layer.msg('请选择一个文件进行上传')
            // 得到这个文件
        const file = e.target.files[0];
        // 将这个文件转换为路径
        const imgUrl = URL.createObjectURL(file);
        // 3. 重新初始化裁剪区域
        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", imgUrl) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })
    $('#btn_Upload').click(() => {
        // 1、拿到用户裁切之后的头像
        // 直接复制代码即可
        const dataURL = $image.cropper("getCroppedCanvas", {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100,
            })
            .toDataURL("image/png");
        // 2:发送ajax请求
        $.post('/my/update/avatar', { avatar: dataURL }, res => {
            const { status, message } = res;
            if (status !== 0) return layer.msg(message);
            layer.msg(message);
            // 重新调用父级页面中的获取用户信息并且渲染页面的功能
            window.parent.getUserInfo()
        })
    })
})