import { FC, memo, Key, useMemo } from 'react'
import { Tree } from "antd";
import { useComponentsStore } from '@/editorStore/components'

/** 配置, title对应desc字段 key对应id字段 */
const treeField = { title: 'desc', key: 'id' }

/** 展示区组件的大纲 */
const ComponentOutline: FC = () => {

  const { components, addSelectedComponent, selectedComponentId } = useComponentsStore()

  const selectedKeys = useMemo(() => [selectedComponentId as Key], [selectedComponentId])

  return (
    <Tree
      fieldNames={treeField}
      treeData={components as any}
      showLine
      defaultExpandAll
      selectedKeys={selectedKeys}
      onSelect={([selectedKey]) => {
        addSelectedComponent(selectedKey as number);
      }}
    />
  )
}

export default memo(ComponentOutline)