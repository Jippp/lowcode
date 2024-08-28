import { FC, memo } from 'react'
import { PreviewComponentWithChildren } from '@/editor/interface'

const Container: FC<PreviewComponentWithChildren> = ({ styles, children }) => {
  
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