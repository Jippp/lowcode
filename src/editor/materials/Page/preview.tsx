import { FC, memo } from 'react'
import { PreviewComponentWithChildren } from '@/editor/interface'

const Page: FC<PreviewComponentWithChildren> = ({ styles, children }) => {

  return (
    <div 
      style={styles}
      className='p-[8px]'
    >{children}</div>
  )
}

export default memo(Page)