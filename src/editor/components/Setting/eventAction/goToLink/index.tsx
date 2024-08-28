import { useMemoizedFn } from 'ahooks'
import { Input } from 'antd'
import { ChangeEventHandler, FC, memo, useEffect, useState } from 'react'
import { ActionItem, GoToLinkValue } from '@/editor/stores/components' 

export type GoToLinkOnChange = (goToLinkValue: GoToLinkValue) => void;

interface GoToLinkProps {
  actionItem: ActionItem;
  onChange: GoToLinkOnChange;
}

const GoToLink: FC<GoToLinkProps> = ({ actionItem, onChange }) => {
  const [value, setValue] = useState(actionItem.url as string)

  const urlChange: ChangeEventHandler<HTMLInputElement> = useMemoizedFn((e) => {
    const inputV = e.target.value
    
    setValue(inputV)
    onChange({ url: inputV })
  })

  // 受控
  useEffect(() => {
    setValue(actionItem.url as string)
  }, [actionItem.url])
  
  return (
    <div className='flex items-center gap-[10px] mt-[10px]'>
      <div>链接</div>
      <div>
        <Input className='w-[480px]' onChange={urlChange} value={value}/>
      </div>
    </div>
  )
}

export default memo(GoToLink)