import { FC, memo } from 'react'
import { Form, Input } from 'antd'
import { useComponentsStore } from '@/editorStore/components'
import { useComponentConfigStore } from '@/editorStore/component-config'

const ComponentAttr: FC = () => {

  const [form] = Form.useForm();

  const { selectedComponentId, selectedComponent, } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  // 没有选中不展示
  if(!selectedComponentId) return null

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label='组件id'>
        <Input value={selectedComponentId} disabled />
      </Form.Item>
      <Form.Item label='组件名称'>
        <Input value={selectedComponent!.name} disabled />
      </Form.Item>
      <Form.Item label='组件描述'>
        <Input value={selectedComponent!.desc} disabled />
      </Form.Item>

    </Form>
  )
}

export default memo(ComponentAttr)