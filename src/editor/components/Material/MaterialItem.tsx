import { FC, memo } from 'react'
import { useDrag } from 'react-dnd'
import { DragObject } from '@/editor/interface'

interface MaterialItemProps {
  name: string;
}

const MaterialItem: FC<MaterialItemProps> = ({name}) => {
  
  const [_, dragRef] = useDrag<DragObject>({
    // 当前drag元素的标识，drop的时候根据这个值来决定是否accept
    type: name,
    // 传递的数据
    item: {
      type: name
    }
  })
  
  return (
    <div ref={dragRef} className='
      border-dashed
      border-[1px]
      border-[#000]
      py-[8px] px-[10px]
      m-[10px]
      cursor-move
      inline-block
      bg-white
      hover:bg-[#ccc]
    '>{name}</div>
  )
}

export default memo(MaterialItem)