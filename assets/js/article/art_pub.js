$(function() {
    const form = layui.form;
    // 初始化富文本编辑器
    initEditor()
        // 定义一个获取文章分类的方法
    const initArtList = () => {
            $.ajax({
                type: 'GET',
                url: '/my/article/cates',
                success: res => {
                    const { status, message, } = res
                    if (status !== 0) return layer.msg(message)
                        // 利用template模版引擎生成模版字符串
                    const htmlStr = template('tpl-cate', res)
                        // console.log(htmlStr);
                        // 插入到指定的[name=cate_id]中
                    $('[name=cate_id]').html(htmlStr)
                        // 一定要记得调用 form.render() 方法 否则看不到页面的变化
                    form.render();
                }
            })
        }
        // 点击上传按钮模拟触发隐藏文件上传输入框
    $('#chooseImg').click(() => {
            $('#coverFile').click()
        })
        // 添加coverFile表单的change事件
    $('#coverFile').change((e) => {
            // 1:定义一个常量获取到选择到的图片的长度
            const fileLength = e.target.files.length;
            // 2：添加判断，如果长度等于0说明没有选中就直接返回
            if (fileLength === 0) return;
            // 定义一个常量获取这个图片的
            const file = e.target.files[0]
            const imgUrl = URL.createObjectURL(file)
                // 为裁剪区域重新设置图片
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', imgUrl) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 定义发布状态
    let art_state = '已发布';
    // console.log(art_state);
    $('#btnSave2').on('click', function() {

            art_state = '草稿'
                // console.log(art_state);
        })
        // 发布文章
    $('#form-pub').submit(function(e) {
        e.preventDefault();
        // new一个表单管理对象
        const fd = new FormData($(this)[0])
            // 给表单添加
        fd.append('state', art_state);
        // console.log(fd.get('title'));
        // console.log(fd.get('cate_id'));
        // console.log(fd.get('cate_id'));
        // console.log(fd.get('status'));
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })
    const publishArticle = (fd) => {
            $.ajax({
                type: 'POST',
                url: '/my/article/add',
                data: fd,
                // 注意：如果向服务器提交的是 FormData 格式的数据，
                // 必须添加以下两个配置项
                contentType: false,
                processData: false,
                success: res => {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)
                    location.href = '/article/art_list.html'
                    window.parent.changeLight()
                }
            })
        }
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    initArtList()
})