import { FC, memo } from 'react'
import { ComponentWithChildren } from '@/editor/interface'
import useMaterialDrop from '@/editor/hooks/useMaterialDrop'

const Container: FC<ComponentWithChildren> = ({ id, children }) => {

  const [{ canDrop }, dropRef] = useMaterialDrop({
    id, accept: ['Button', 'Container']
  })
  
  return (
    <div 
      data-component-id={id}
      ref={dropRef} 
      className={
        `border-[1px] border-[#ccc] min-h-[100px] p-[20px] ${canDrop ? 'border-[2px] border-[blue]' : ''}`
      }
    >
      {children}
    </div>
  )
}

export default memo(Container)