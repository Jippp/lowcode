// 对useDrop的再封装
import { useDrop } from 'react-dnd'
import { message } from 'antd'
import { DragObject, CollectedProps } from '@/editor/interface'
import { useComponentConfigStore } from '@/editorStore/component-config'
import { useComponentsStore, Component } from '@/editorStore/components'

interface UseMaterialDropProps {
  id: Pick<Component, 'id'>['id'];
  accept: string[]
}

export default ({ id, accept }: UseMaterialDropProps) => {
  const { componentConfig } = useComponentConfigStore()
  const { addComponent } = useComponentsStore()

  return useDrop<DragObject, unknown, CollectedProps>(() => ({
    accept,
    drop(item, monitor) {
      // 也会触发外层的useDrop.drop
      const didDrop = monitor.didDrop()
      if(didDrop) return
      const props = componentConfig[item.type].defaultProps
      addComponent({
        id: Date.now(),
        name: item.type,
        props
      }, id)
      message.success(item.type)
    },
    collect(monitor) {
      return {
        canDrop: monitor.canDrop()
      }
    }
  }))
}
