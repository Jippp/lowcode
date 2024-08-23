import { FC, memo, createElement, Fragment, useMemo } from 'react'
import { useMemoizedFn } from 'ahooks'
import { useComponentsStore, Component } from '@/editorStore/components'
import { useComponentConfigStore } from '@/editorStore/component-config'

const EditArea: FC = () => {

  const { components } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

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
      return <Fragment></Fragment>
    })
  })

  const renderedDom = useMemo(() => renderComponents(components), [renderComponents, components])

  return (
    <>
      <pre className='max-h-[300px] overflow-x-auto'>{ JSON.stringify(components, null, 2) }</pre>
      {renderedDom}
    </>
  )
}

export default memo(EditArea)