$(function() {
    const form = layui.form
        // 获取文章列表
    const initArtList = () => {
            $.ajax({
                method: 'GET',
                url: '/my/article/cates',
                success: res => {
                    const { data, message, status } = res;
                    if (status !== 0) return layer.msg(message)
                        // layer.msg(message)
                        // 调用模版引擎
                    const htmlStr = template('tpl-table', res)
                        // 将引擎模版生成的内容赋值给tbody中的html内容
                    $('tbody').empty().html(htmlStr)
                }
            })
        }
        // 给添加分类的按钮绑定点击事件
    let btnAddIndex = null;
    $('#btnAddCate').click((e) => {
        // 调用layui的open方法弹出模态框
        btnAddIndex = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $('#dialog-add').html()
        });
    })

    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault();
            const data = $(this).serialize();
            $.ajax({
                method: 'post',
                url: '/my/article/addcates',
                data,
                success: res => {
                    const { status, message } = res;
                    if (status !== 0) return layer.msg({ message })
                        // layer.msg(message)
                        //  重新渲染数据列表
                    initArtList()
                        // 关闭模态框
                    layer.close(btnAddIndex)
                        // $('body').on('click', '.layui-layer-setwin', function() {
                        //     console.log(22);
                        // })
                }
            })
        })
        // 绑定编辑按钮通过事件委托的形式委托到tbody打开模态框
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        const id = $(this).attr('data-id'); //点击编辑之后用一个常量接收一下点击的当前的这个编辑按钮身上的 data-id 自定义属性值
        // console.log(id);

        // 点击编辑按钮通过layui的layer.open组件生成一个模态框
        indexEdit = layer.open({ // layer.open方法返回一个索引index
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html(),
        })
        $.ajax({
                type: "GET",
                url: '/my/article/cates/' + id,
                success: res => {
                    const { data, status, message } = res;
                    if (status !== 0) return layer.msg(message);
                    form.val("form-edit", data); // 利用layui中的form.val()方法快速渲染到表单中
                }
            })
            // 修改文章分类，通过事件委托
            // 更新文章分类
        $("body").on("submit", "#form-edit", function(e) {
            const data = $(this).serialize();
            e.preventDefault();
            $.ajax({
                method: "POST",
                url: "/my/article/updatecate",
                data,
                success: (res) => {
                    const { status } = res;
                    if (status !== 0) return layer.msg("更新分类数据失败！");
                    layer.msg("更新分类数据成功！");
                    layer.close(indexEdit);
                    initArtList();
                },
            });
        });
        // 添加删除功能
        // 删除文章分类
        $("tbody").on("click", ".btn-delete", function() { // 利用事件委托将事件绑定给tbody
            const id = $(this).attr("data-id"); //  取出点击的当前的删除按钮身上的data-id属性的值
            // 利用layui组件layer.confirm()提示用户是否删除
            layer.confirm("确定删除吗？", { icon: 3, title: "提示" }, function(index) {
                $.ajax({
                    method: "GET",
                    url: "/my/article/deletecate/" + id,
                    success: function(res) {
                        const { status, message } = res
                        if (status !== 0) return layer.msg(message);
                        layer.msg(message);
                        layer.close(index); // 关闭询问模态框
                        initArtList(); //重新渲染
                    },
                });
            });
        });
    })
    initArtList()
})