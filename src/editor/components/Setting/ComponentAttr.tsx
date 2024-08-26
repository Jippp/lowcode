import { FC, memo, useEffect, useMemo } from 'react'
import { Form, Input, Select } from 'antd'
import { useMemoizedFn } from 'ahooks'
import { useComponentsStore } from '@/editorStore/components'
import { useComponentConfigStore, ComponentSetter, ComponentConfig } from '@/editorStore/component-config'

/** 组件属性相关 */
const ComponentAttr: FC = () => {

  const [form] = Form.useForm();

  const { selectedComponentId, selectedComponent, updateComponentProps } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const componentConfigItem = useMemo(() => (
    selectedComponent ? componentConfig[selectedComponent.name] : {}
  ) as ComponentConfig, [componentConfig, selectedComponent])

  /** 根据配置的type来渲染对应组件 */
  const renderComponentByType = useMemoizedFn((setterConfig: ComponentSetter) => {
    const { type, options } = setterConfig
    
    switch(type) {
      case 'input':
        return <Input />
      case 'select':
        return <Select options={options} />
    }
  })

  // 编辑后更新所选中的组件
  const hanldeFormChange = useMemoizedFn((changedValues) => {
    if(selectedComponentId) {
      updateComponentProps(selectedComponentId, changedValues)
    }
  })

  // 选中的组件变化，更新对应Form
  useEffect(() => {
    form.resetFields()
    const data = form.getFieldsValue()
    form.setFieldsValue({ ...data, ...selectedComponent?.props })
  }, [form, selectedComponent])

  // 没有选中不展示
  if(!selectedComponentId) return null

  return (
    <Form
      form={form}
      onValuesChange={hanldeFormChange}
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
      {/* 其他配置项 */}
      {
        componentConfigItem?.setter?.map((setterConfig) => (
          <Form.Item 
            key={setterConfig.name}
            name={setterConfig.name}
            label={setterConfig.label}
          >
            {renderComponentByType(setterConfig)}
          </Form.Item>
        ))
      }
    </Form>
  )
}

export default memo(ComponentAttr)