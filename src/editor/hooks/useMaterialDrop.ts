// 对useDrop的再封装
import { useDrop } from 'react-dnd'
import { message } from 'antd'
import { DragObject, CollectedProps } from '@/editor/interface'
import { useComponentConfigStore } from '@/editorStore/component-config'
import { useComponentsStore, Component, getComponentById } from '@/editorStore/components'

interface UseMaterialDropProps {
  id: Pick<Component, 'id'>['id'];
  accept: string[]
}

export default ({ id, accept }: UseMaterialDropProps) => {
  const { componentConfig } = useComponentConfigStore()
  const { components, addComponent, deleteComponent } = useComponentsStore()

  return useDrop<DragObject, unknown, CollectedProps>(() => ({
    accept,
    drop(item, monitor) {
      // 也会触发外层的useDrop.drop
      const didDrop = monitor.didDrop()
      if(didDrop) return
      const config = componentConfig[item.type]

      if(item.dragType === 'move' && item.dragComponentId) {
        // 先删除 再新建
        const dragComponent = getComponentById(item.dragComponentId, components)
        if(dragComponent) {
          deleteComponent(item.dragComponentId)
          addComponent(dragComponent, id)
        }
      }else {
        addComponent({
          id: Date.now(),
          name: item.type,
          desc: config.desc,
          props: config.defaultProps
        }, id)
        message.success(item.type)
      }
    },
    collect(monitor) {
      return {
        canDrop: monitor.canDrop()
      }
    }
  }))
}
