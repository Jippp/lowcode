import { CSSProperties, FC, memo, useEffect, useMemo, useState } from 'react'
import { Form, Input, InputNumber } from 'antd'
import { useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import styleParser from 'style-to-object'
import { ComponentConfig, ComponentSetter, useComponentConfigStore } from '@/editorStore/component-config'
import { useComponentsStore } from '@/editorStore/components'
import CssEditor, { OnChange } from './CssEditor'

/** 将存储的styles转为css样式 */
function toCSSStr(styles: CSSProperties) {
  let str = `.comp {\n`;
  for (const key in styles) {
    let value = styles[key as keyof CSSProperties];
    if (!value) {
      continue;
    }
    if (['width', 'height'].includes(key) && !value.toString().endsWith('px')) {
      value += 'px';
    }

    str += `\t${key}: ${value};\n`
  }
  str += `}`;
  return str;
}

const defaultCssValue = `.comp{\n\n}`

/** 组件样式相关 */
const ComponentStyle: FC = () => {
  const [form] = Form.useForm()
  const [cssValue, setCssValue] = useState(defaultCssValue)

  const { selectedComponent, selectedComponentId, updateComponentStyles } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const componentConfigItem = useMemo(() => (
    selectedComponent ? componentConfig[selectedComponent.name] : {}
  ) as ComponentConfig, [componentConfig, selectedComponent])

  /** 根据配置的type来渲染对应组件 */
  const renderComponentByType = useMemoizedFn((setterConfig: ComponentSetter) => {
    const { type } = setterConfig

    switch (type) {
      case 'input':
        return <Input />
      case 'inputNumber':
        return <InputNumber />
    }
  })

  // 编辑后更新所选中的组件
  const handleFormChange = useMemoizedFn((changedValues) => {
    if (selectedComponentId) {
      updateComponentStyles(selectedComponentId, changedValues)
    }
  })

  /** css编辑器变动 解析然后更新styles */
  const handleCssChange: OnChange = useMemoizedFn(debounce((value) => {
    if (!selectedComponentId) return null
    try {
      setCssValue(value)
      const css: Record<string, any> = {}
      const cssStr = value.replace(/\/\*.*\*\//, '') // 去掉注释 /** */
        .replace(/(\.?[^{]+{)/, '') // 去掉 .comp {
        .replace('}', '');// 去掉 }

      styleParser(cssStr, (name, value) => {
        css[name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))] = value;
      });
      updateComponentStyles(selectedComponentId, {
        ...form.getFieldsValue(),
        ...css
      }, true)
    } catch (error) {
      console.error(error)
    }
  }, 500))

  // 选中的组件变化，更新对应Form
  useEffect(() => {
    // 切换选中的组件，重置
    form.resetFields()

    const data = form.getFieldsValue()
    form.setFieldsValue({ ...data, ...selectedComponent?.props })

    if(selectedComponent?.styles) {
      setCssValue(toCSSStr(selectedComponent.styles))
    }else {
      setCssValue(defaultCssValue)
    }
  }, [form, selectedComponent])

  if (!selectedComponentId) return null

  return (
    <Form
      form={form}
      onValuesChange={handleFormChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      {
        componentConfigItem?.stylesSetter?.map((setterConfig) => (
          <Form.Item
            key={setterConfig.name}
            name={setterConfig.name}
            label={setterConfig.label}
          >
            {renderComponentByType(setterConfig)}
          </Form.Item>
        ))
      }
      <div className='h-[200px] border-[1px] border-[#ccc]'>
        <CssEditor cssValue={cssValue} onChange={handleCssChange} />
      </div>
    </Form>
  )
}

export default memo(ComponentStyle)
