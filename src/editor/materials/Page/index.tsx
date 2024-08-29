import { FC, memo } from 'react'
import { ComponentWithChildren } from '@/editor/interface'
import useMaterialDrop from '@/editor/hooks/useMaterialDrop'

const Page: FC<ComponentWithChildren> = ({ id, styles, children }) => {

  const [{ canDrop }, dropRef] = useMaterialDrop({
    id, accept: ['Button', 'Container', 'Modal'],
  })

  return (
    <div 
      data-component-id={id}
      ref={dropRef} 
      style={styles}
      className={
        `border-[1px] 
        border-[#000] 
        p-[8px]
        h-[100vh]
        ${canDrop ? 'border-[2px] border-[blue]' : ''}`}
    >{children}</div>
  )
}

export default memo(Page)