import { FC, memo, useState } from 'react'
import { Segmented } from 'antd'
import { useMemoizedFn } from 'ahooks'
import ComponentMaterial from './ComponentMaterial'
import ComponentOrigin from './ComponentOrigin'
import ComponentOutline from './ComponentOutline'

const MaterialConfig = ['物料', '大纲', '源码']

const Material: FC = () => {
  const [selectedKey, setSelectedKey] = useState(MaterialConfig[0])

  const handleChangeSegment = useMemoizedFn((value: string) => {
    setSelectedKey(value)
  })

  return (
    <div className='p-[8px] h-[100%]'>
      <Segmented
        value={selectedKey}
        onChange={handleChangeSegment}
        block
        options={MaterialConfig}
      />
      {/* 32px是上面segmented的高度 */}
      <div className='p-[8px] h-[calc(100%-32px)] overflow-auto'>
        { selectedKey === MaterialConfig[0] && <ComponentMaterial /> }
        { selectedKey === MaterialConfig[1] && <ComponentOutline /> }
        { selectedKey === MaterialConfig[2] && <ComponentOrigin /> }
      </div>
    </div>
  )
}

export default memo(Material)