import { FC, memo } from 'react'
import { ComponentWithChildren } from '@/editor/interface'
import useMaterialDrop from '@/editor/hooks/useMaterialDrop'

const Container: FC<ComponentWithChildren> = ({ id, styles, children }) => {

  const [{ canDrop }, dropRef] = useMaterialDrop({
    id, accept: ['Button', 'Container', 'Modal']
  })
  
  return (
    <div 
      data-component-id={id}
      ref={dropRef} 
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