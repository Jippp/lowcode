import { ChangeEventHandler, FC, memo, useEffect } from 'react'
import { Input, Select } from 'antd'
import { useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es';
import { useImmer } from 'use-immer';
import { ActionItem, ShowMessageSelectValue, ShowMessageInputValue } from '@/editor/stores/components' 

export type ShowMessageSelectOnChange = (showMessageValue: ShowMessageSelectValue) => void;
export type ShowMessageInputOnChange = (showMessageValue: ShowMessageInputValue) => void;

interface Props {
  actionItem: ActionItem;
  selectOnChange: ShowMessageSelectOnChange;
  inputOnChange: ShowMessageInputOnChange;
}

const selectOption = [
  { label: '成功', value: 'success' },
  { label: '失败', value: 'error' },
]

const ShowMessage: FC<Props> = ({
  actionItem, selectOnChange, inputOnChange
}) => {
  const [value, updateValue] = useImmer({
    messsageMethod: actionItem.messsageMethod,
    messsageContent: actionItem.messsageContent
  })

  const handleSelectChange = useMemoizedFn((value: string) => {
    updateValue(d => {
      d.messsageMethod = value
    })
    selectOnChange({ messsageMethod: value })
  })
  
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = useMemoizedFn(debounce((e) => {
    const inputV = e.target.value
    updateValue(d => {
      d.messsageContent = inputV
    })
    inputOnChange({ messsageContent: inputV })
  }, 500))

  // 受控
  useEffect(() => {
    updateValue(d => {
      d.messsageContent = actionItem.messsageContent
      d.messsageMethod = actionItem.messsageMethod
    })
  }, [actionItem, updateValue])

  return (
    <>
      <div className='flex items-center mt-[10px]'>
        <span className='mr-[8px]'>类型:</span>
        <Select
          className='w-[480px]'
          options={selectOption}
          onChange={handleSelectChange}
          value={value.messsageMethod}
        />
      </div>
      <div className='flex items-center mt-[10px]'>
        <span className='mr-[8px]'>文本:</span>
        <Input 
          className='w-[480px]'
          value={value.messsageContent}
          onChange={handleInputChange} 
        />
      </div>
    </>
  )
}

export default memo(ShowMessage)