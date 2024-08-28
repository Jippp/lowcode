import { FC, memo, createElement, useMemo } from 'react'
import { useMemoizedFn } from 'ahooks'
import {
  useComponentsStore,
  Component,
  EventConfigProps
} from '@/editorStore/components'
import { useComponentConfigStore } from '@/editorStore/component-config'
import { EventActionEnums } from '@/editor/components/Setting/eventAction/interface'
import { message } from 'antd'

const Preview: FC = () => {

  const { components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const handleEvent = useMemoizedFn((component: Component) => {
    const props: Record<string, any> = {}

    componentConfig[component.name].eventSetter?.forEach(event => {
      const eventConfig = component.props?.[event.name] as EventConfigProps
      if(eventConfig) {
        const actions = eventConfig.actions || []
        // 批量处理
        const actionRunner = actions.map(actionItem => {
          const { type } = actionItem
          if(type === EventActionEnums.GoToLink) {
            if(actionItem.url) return () => window.location.href = actionItem.url!
          }
          if(type === EventActionEnums.ShowMessage) {
            if(actionItem.messsageContent && actionItem.messsageMethod) {
              if(actionItem.messsageMethod === 'success') {
                return () => message.success(actionItem.messsageContent)
              }
              if(actionItem.messsageMethod === 'error') {
                return () => message.error(actionItem.messsageContent)
              }
            }
          }
          return () => {}
        })

        // 事件处理 绑定到props上传递给组件
        props[event.name] = () => {
          actionRunner.forEach(runner => runner())
        }
      }
    })
    return props
  })

  const renderComponents = useMemoizedFn((components: Component[]): React.ReactNode => {
    return components.map((component: Component) => {
      const config = componentConfig[component.name]
      if(config && config.preview) {
        return createElement(config.preview as any, {
          key: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component)
        }, renderComponents(component.children || []))
      }
      return null
    })
  })

  const renderedDom = useMemo(() => renderComponents(components), [renderComponents, components])

  return (
    <div className='h-[100%] relative'>
      {renderedDom}
    </div>
  )
}

export default memo(Preview)