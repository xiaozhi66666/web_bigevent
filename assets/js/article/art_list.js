$(function() {
    const form = layui.form;
    const laypage = layui.laypage
        // 定义一个查询的参数对象，将来请求数据的时候，
        // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    };
    // 获取文章列表
    const initTable = () => {
            $.ajax({
                type: "GET",
                url: '/my/article/list',
                data: q,
                success: res => {
                    const { data, status, message, total } = res;
                    if (status !== 0) return layer.msg('获取文章列表失败')
                        // layer.msg('获取文章列表成功')
                        // 调用模版字符方法，将需要渲染的DOM对象的id和需要渲染的对象放进去
                    const htmlStr = template('tpl-table', res)
                        // 将生成的模版字符插入到指定的位置
                    $('tbody').html(htmlStr)
                        // 在获取文章列表的时候就需要将分页功能调用
                    renderPage(res.total)
                }
            })
        }
        // 初始化文章分类
    initTable()
    const initCate = () => {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: res => {
                // console.log(res);
                if (res.status !== 0) return layer.msg('获取文章失败')
                    // layer.msg('获取文章成功')
                    // 利用模版将数据渲染成模版字符
                const htmlStr = template('tpl-cate', res)
                    // 将渲染好的模版字符插入到页面上的指定位置
                $('[name=cate_id]').html(htmlStr)
                    // 通过layui中的form对象方法render()重新渲染表单区域的UI结构
                form.render('select');
            }
        })
    }
    initCate()
        // 筛选功能
    $('#form-search').submit((e) => {
            e.preventDefault();
            q.cate_id = $('[name=cate_id]').val();
            q.state = $('[name=state]').val();
            initTable()
        })
        // 分页功能
    const renderPage = (total) => {
            laypage.render({
                elem: 'pageBox',
                count: total,
                limit: q.pagesize, // 每页显示几条数据
                curr: q.pagenum, // 设置默认被选中的分页
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [2, 3, 5, 10], // 每页展示多少条
                // 切花分页的时候触发的事件，layui中分页功能提供的方法
                jump: (obj, first) => {
                    // console.log(first);
                    q.pagenum = obj.curr
                        // console.log(obj);
                    q.pagesize = obj.limit
                        // jump 的第二个参数就能帮我们判断出来，如果第二个参数为true，就代表是利用 `laypage.render()` 方法触发的
                    if (!first) {
                        initTable()
                    }
                }
            })
        }
        // 添加删除功能，后面生成的按钮利用事件委托绑定
    $('tbody').on('click', '.btn-del', function(e) {
            // e.preventDefault();
            // 获取删除按钮的个数
            let benLen = $('.btn-del').length;
            // console.log(benLen);
            const id = $(this).attr('data-id')
                // console.log(id);
            layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function(index) {
                $.ajax({
                    type: 'GET',
                    url: '/my/article/delete/' + id,
                    success: res => {
                        if (res.status !== 0) return layer.msg(res.message)
                        layer.msg(res.message)
                        if (benLen === 1)
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                            // 重新渲染
                        initTable()
                    }
                })
                layer.close(index);
            });

        })
        // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
})