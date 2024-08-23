import { FC, memo, useMemo } from 'react'
import { useComponentConfigStore } from '@/editorStore/component-config'
import MaterialItem from './MaterialItem'

const Material: FC = () => {
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

export default memo(Material)