import { FC, memo, createElement, useMemo } from 'react'
import { useMemoizedFn } from 'ahooks'
import { useComponentsStore, Component } from '@/editorStore/components'
import { useComponentConfigStore } from '@/editorStore/component-config'

const Preview: FC = () => {

  const { components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const renderComponents = useMemoizedFn((components: Component[]): React.ReactNode => {
    return components.map((component: Component) => {
      const config = componentConfig[component.name]
      if(config && config.preview) {
        return createElement(config.preview as any, {
          key: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props
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