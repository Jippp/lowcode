import { FC, memo, useState } from 'react'
import { Segmented } from 'antd'
import { useMemoizedFn } from 'ahooks'
import ComponentAttr from './ComponentAttr'
import ComponentEvent from './ComponentEvent'
import ComponentStyle from './ComponentStyle'

const segmentConfig = ['属性', '样式', '事件']

const Setting: FC = () => {
  const [selectedKey, setSelectedKey] = useState(segmentConfig[0])
  
  /** 切换 */
  const handleChangeSegment = useMemoizedFn((value) => {
    setSelectedKey(value)
  })

  return (
    <div className='p-[8px]'>
      <Segmented
        value={selectedKey}
        onChange={handleChangeSegment}
        block
        options={segmentConfig}
      />
      <div className='p-[8px]'>
        {selectedKey === segmentConfig[0] && <ComponentAttr />}
        {selectedKey === segmentConfig[1] && <ComponentStyle />}
        {selectedKey === segmentConfig[2] && <ComponentEvent />}
      </div>
    </div>
  )
}

export default memo(Setting)