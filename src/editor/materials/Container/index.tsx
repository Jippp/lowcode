import { FC, memo, useEffect, useRef } from 'react'
import { useDrag } from 'react-dnd'
import { ComponentWithChildren, DragObject } from '@/editor/interface'
import useMaterialDrop from '@/editor/hooks/useMaterialDrop'

const Container: FC<ComponentWithChildren> = ({ id, name, styles, children }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [_, dragRef] = useDrag<DragObject>({
    type: name,
    item: {
      type: name,
      dragType: 'move',
      dragComponentId: id
    }
  })

  const [{ canDrop }, dropRef] = useMaterialDrop({
    id, accept: ['Button', 'Container', 'Modal']
  })

  // 绑定元素
  useEffect(() => {
    dragRef(containerRef)
    dropRef(containerRef)
  }, [dragRef, dropRef])
  
  return (
    <div 
      data-component-id={id}
      ref={containerRef} 
      style={styles}
      className={
        `border-[1px] border-[#ccc] min-h-[100px] p-[20px] ${canDrop ? 'border-[2px] border-[blue]' : ''}`
      }
    >
      {children}
    </div>
  )
}

export default memo(Container)