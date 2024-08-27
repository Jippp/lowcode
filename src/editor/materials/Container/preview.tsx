import { FC, memo } from 'react'
import { ComponentWithChildren } from '@/editor/interface'

const Container: FC<ComponentWithChildren> = ({ styles, children }) => {
  
  return (
    <div 
      style={styles}
      className={`min-h-[100px] p-[20px]`}
    >
      {children}
    </div>
  )
}

export default memo(Container)