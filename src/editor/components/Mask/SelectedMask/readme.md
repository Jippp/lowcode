# 实现的功能

1. 高亮边框
2. 删除按钮，点击二次提示是否删除
3. 层级下拉展示，可展示该组件的层级路径(即父级组件)
4. 高亮边框容器变化之后，需要能自动更新搞高亮边框，所以useEffect中监听了一个components的变化。components变化后重新计算高亮边框的位置。
5. 窗口大小变化，高亮边框也需要重新计算位置。
