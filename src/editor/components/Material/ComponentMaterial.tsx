import { useComponentConfigStore } from '@/editor/stores/component-config'
import { FC, memo, useMemo } from 'react'
import MaterialItem from './MaterialItem'

/** 提供组件的物料区 */
const ComponentMaterial: FC = () => {
  const { componentConfig } = useComponentConfigStore()

  const components = useMemo(() => 
    Object.values(componentConfig).filter(item => item.name !== 'Page')
  ,[componentConfig])
  
  return (
    <>
      {
        components.map(item => <MaterialItem key={item.name} name={item.name} desc={item.desc} />)
      }
    </>
  )
}

export default memo(ComponentMaterial)