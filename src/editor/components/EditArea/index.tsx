import { FC, memo, createElement, MouseEventHandler, useMemo, useState, useRef } from 'react'
import { useMemoizedFn } from 'ahooks'
import { useComponentsStore, Component } from '@/editorStore/components'
import HoverMask from '@/editor/components/Mask/HoverMask'
import SelectedMask from '@/editor/components/Mask/SelectedMask'
import { useComponentConfigStore } from '@/editorStore/component-config'

const getDomDataSet = (
  e: React.MouseEvent<Element, MouseEvent>, 
  dataset: string = 'componentId'
) => {
  // 调用原生事件上的方法，获取触发的元素路径数组(最近 -> 最远 冒泡的顺序)
  const composedPath = e.nativeEvent.composedPath()
  for(let i = 0; i < composedPath.length; i++) {
    const ele = composedPath[i] as HTMLElement
    // 获取dataset的属性(data-component-id)
    const dataSetId = ele.dataset?.[dataset]
    if(dataSetId) {
      return Number(dataSetId) as number
    }
  }
}

const EditArea: FC = () => {
  const [hoverComponentId, setHoverComponentId] = useState<number>()
  const portalWrapperRef = useRef<HTMLDivElement>(null)

  const { components, selectedComponentId, addSelectedComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const handleMouseOver: MouseEventHandler = useMemoizedFn((e) => {
    const componentId = getDomDataSet(e)
    if(componentId) setHoverComponentId(componentId)
  })
  const handleMouseLevel = useMemoizedFn(() => {
    setHoverComponentId(undefined)
  })

  const handleClick: MouseEventHandler = useMemoizedFn((e) => {
    const componentId = getDomDataSet(e)
    addSelectedComponent(componentId === selectedComponentId ? undefined : componentId)
  })

  const renderComponents = useMemoizedFn((components: Component[]): React.ReactNode => {
    return components.map((component: Component) => {
      const config = componentConfig[component.name]
      if(config && config.component) {
        return createElement(config.component as any, {
          key: component.id,
          id: component.id,
          name: component.name,
          ...config.defaultProps,
          ...component.props
        }, renderComponents(component.children || []))
      }
      return null
    })
  })

  const renderedDom = useMemo(() => renderComponents(components), [renderComponents, components])

  return (
    <div 
      className='h-[100%] relative editor-area' 
      onMouseOver={handleMouseOver} 
      onMouseLeave={handleMouseLevel}
      onClick={handleClick}
    >
      {renderedDom}
      {hoverComponentId && selectedComponentId !== hoverComponentId && (
        <HoverMask 
          componentId={hoverComponentId} 
          containerClassName='editor-area' 
          portalWrapper={portalWrapperRef.current as HTMLElement}
        />
      )}
      {
        selectedComponentId && (
          <SelectedMask 
            componentId={selectedComponentId} 
            containerClassName='editor-area' 
            portalWrapper={portalWrapperRef.current as HTMLElement}
          />
        )
      }
      <div ref={portalWrapperRef}></div>
    </div>
  )
}

export default memo(EditArea)