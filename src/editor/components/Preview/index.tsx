import { FC, memo, createElement, useMemo, ReactNode, useRef } from 'react'
import { useMemoizedFn } from 'ahooks'
import {
  useComponentsStore,
  Component,
  EventConfigProps
} from '@/editorStore/components'
import { useComponentConfigStore } from '@/editorStore/component-config'
import { EventActionEnums } from '@/editor/components/Setting/eventAction/interface'
import { message } from 'antd'
import { useImmer } from 'use-immer'

const Preview: FC = () => {
  const [componentRefsMap, updateComponentRefsMap] = useImmer<Record<number, ReactNode>>({})
  const componentRefsMapCache = useRef<Record<number, ReactNode>>({})

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
          if(type === EventActionEnums.CustomJS) {
            if(actionItem.code) {
              return () => {
                // 最后一个参数是函数体，前面的是函数参数名称
                const run = new Function('context', actionItem.code!)
                run({
                  name: component.name,
                  props: component.props,
                })
              }
            }
          }
          if(type === EventActionEnums.ComponentAction) {
            if(actionItem.componentId && actionItem.componentMethod) {
              const actionTargetComponent = componentRefsMapCache.current[actionItem.componentId]
              if(actionTargetComponent && (actionTargetComponent as any)[actionItem.componentMethod]) {
                return (actionTargetComponent as any)[actionItem.componentMethod]
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

  const renderComponentsWithRef = useMemoizedFn((components: Component[]): React.ReactNode => {
    return components.map((component: Component) => {
      const config = componentConfig[component.name]
      if(config && config.preview) {
        const element = config.preview as any
        const isForwardRefComponent = element.$$typeof === Symbol.for('react.forward_ref')
        return createElement(element, {
          key: component.id,
          name: component.name,
          styles: component.styles,
          ref: isForwardRefComponent ? (node: ReactNode) => {
            if(!componentRefsMapCache.current[component.id]) {
              updateComponentRefsMap(d => {
                d[component.id] = node
              })
              componentRefsMapCache.current[component.id] = node
            }
          } : undefined,
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component),
        }, renderComponentsWithRef(component.children || []))
      }
      return null
    })
  })

  const renderComponents = useMemoizedFn((components: Component[]): React.ReactNode => {
    return components.map((component: Component) => {
      const config = componentConfig[component.name]
      if(config && config.preview) {
        const element = config.preview as any
        return createElement(element, {
          key: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component),
        }, renderComponents(component.children || []))
      }
      return null
    })
  })

  const renderedDom = useMemo(() => {
    /* 
      render两遍：ref的挂载是在更新提交阶段执行的，必须要先render一遍拿到所有的ref
      才能在handleEvent里拿到所有的ref进行ComponentAction的判断
      第一遍的目的是挂载ref，第二遍render的目的是执行handleEvent处理事件
    */
    if(Object.keys(componentRefsMap).length) {
      return renderComponents(components)
    }else {
      return renderComponentsWithRef(components)
    }
  }, [renderComponents, renderComponentsWithRef, components, componentRefsMap])

  return (
    <div className='h-[100%] relative'>
      {renderedDom}
    </div>
  )
}

export default memo(Preview)