import { Button, Flex } from 'antd'
import { FC, memo } from 'react'
import { useComponentsStore } from '@/editorStore/components'
import { useMemoizedFn } from 'ahooks'

const Header: FC = () => {
  const { status, changeStatus, addSelectedComponent } = useComponentsStore()

  const handlePreview = useMemoizedFn(() => {
    changeStatus('preview')
    // 预览取消选中
    addSelectedComponent(undefined)
  })
  const handleEditing = useMemoizedFn(() => {
    changeStatus('editing')
  })

  return (
    <Flex justify='space-between' className='w-[100%] p-[10px]'>
      <div>低代码</div>
      <Flex gap={8}>
        <Button type="primary" onClick={handlePreview} disabled={status === 'preview'}>预览</Button>
        <Button type="primary" onClick={handleEditing} disabled={status === 'editing'}>退出</Button>
      </Flex>
    </Flex>
  )
}

export default memo(Header)