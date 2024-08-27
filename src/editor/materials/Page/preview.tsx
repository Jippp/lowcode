import { FC, memo } from 'react'
import { ComponentWithChildren } from '@/editor/interface'

const Page: FC<ComponentWithChildren> = ({ styles, children }) => {

  return (
    <div 
      style={styles}
      className='p-[8px]'
    >{children}</div>
  )
}

export default memo(Page)