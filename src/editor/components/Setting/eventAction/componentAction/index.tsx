import { useMemoizedFn } from 'ahooks'
import { Select, TreeSelect } from 'antd'
import { FC, memo, useEffect, useMemo } from 'react'
import { ActionItem, ComponentActionIdValue, ComponentActionMethodValue, ComponentActionValue } from '@/editor/stores/components'
import { ComponentConfig, useComponentConfigStore } from '@/editorStore/component-config'
import { useComponentsStore, getComponentById, Component } from '@/editorStore/components'
import { useImmer } from 'use-immer'

export type ComponentActionIdOnChange = (selectValue: ComponentActionIdValue) => void
export type ComponentActionMethodOnChange = (selectValue: ComponentActionMethodValue) => void

/** 递归找到可交互的组件 */
const findActionableComponents: (components: Component[], componentConfig: {
  [key: string]: ComponentConfig
}) => Component[] = (components, componentConfig) => {
  const result = [] as Component[]
  function run(components: Component[], componentConfig: {
    [key: string]: ComponentConfig
  }) {
    components.forEach(item => {
      if(item.children && item.children.length) {
        run(item.children, componentConfig)
      }
      const config = componentConfig[item.name]
      if(config.methods) result.push(item)
    })
  }
  run(components, componentConfig)
  return result
}

interface GoToLinkProps {
  actionItem: ActionItem;
  onIdChange: ComponentActionIdOnChange;
  onMethodChange: ComponentActionMethodOnChange;
}

const ComponentAction: FC<GoToLinkProps> = ({ actionItem, onIdChange, onMethodChange }) => {
  const [value, updateValue] = useImmer({
    componentMethod: '',
    componentId: 0
  } as ComponentActionValue)

  const { components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const actionableComponents = useMemo(() => {
    return findActionableComponents(components, componentConfig)
  }, [components, componentConfig])

  const currentComponent = useMemo(() => getComponentById(value.componentId, components), [value.componentId, components])

  const actionableOptions = useMemo(() => {
    if(currentComponent) {
      return componentConfig[currentComponent?.name]?.methods?.map(item => ({
        label: item.label,
        value: item.name
      }))
    }else {
      return []
    }
  }, [currentComponent, componentConfig])

  const handleTreeSelectChange = useMemoizedFn((value: number) => {
    updateValue(d => {
      d.componentId = value
    })
    onIdChange({ componentId: value })
  })

  const handleSelectChange = useMemoizedFn((value: string) => {
    updateValue(d => {
      d.componentMethod = value
    })
    onMethodChange({ componentMethod: value })
  })

  // 受控
  useEffect(() => {
    if(actionItem) {
      updateValue(d => {
        d.componentMethod = actionItem.componentMethod!
        d.componentId = actionItem.componentId!
      })
    }
  }, [actionItem, updateValue])

  return (
    <>
      <div className='flex items-center gap-[10px] mt-[10px]'>
        <div>组件: </div>
        <div>
          <TreeSelect
            className='w-[480px] h-[50px]'
            treeData={actionableComponents}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            value={value.componentId}
            onChange={handleTreeSelectChange}
          />
        </div>
      </div>
      <div className='flex items-center gap-[10px] mt-[10px]'>
        <div>方法: </div>
        <div>
          <Select
            className='w-[480px] h-[50px]'
            value={value.componentMethod}
            options={actionableOptions}
            onChange={handleSelectChange}
          />
        </div>
      </div>
    </>
  )
}

export default memo(ComponentAction)