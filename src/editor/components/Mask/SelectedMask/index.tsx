import { FC, memo, MouseEventHandler, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom';
import { useComponentsStore, getComponentById, Component } from '@/editorStore/components'
import { useMemoizedFn, useSize } from 'ahooks';
import { Dropdown, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import useDomPosition from '../useDomPosition';
import { HoverMaskProps } from '../interface'

const labelHeight = 20

const defaultSize = { width: 0, height: 0 }

const SelectedMask: FC<HoverMaskProps> = ({
  componentId, containerClassName, portalWrapper
}) => {
  const { position, updatePositionHandler } = useDomPosition();
  const containerDomRef = useRef(document.querySelector(`.${containerClassName}`))
  const containerSize = useSize(containerDomRef.current) || defaultSize

  containerDomRef.current = document.querySelector(`.${containerClassName}`)

  const { 
    components, 
    selectedComponentId, 
    selectedComponent,
    addSelectedComponent, 
    deleteComponent
  } = useComponentsStore()

  const handleNoBubbleClick: MouseEventHandler = useMemoizedFn((e) => {
    e.stopPropagation()
  })

  const handleDeleteComponent = useMemoizedFn(() => {
    deleteComponent(selectedComponentId!)
    addSelectedComponent(undefined)
  })

  const updatePosition = useMemoizedFn(() => {
    updatePositionHandler({ componentId, containerClassName, labelHeight })
  })

  useEffect(() => {
    updatePosition()
  }, [containerClassName, componentId, components, updatePosition])

  // 页面以及容器宽度变化，重新计算高亮框
  useEffect(() => {
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('resize', updatePosition)
    }
  }, [containerClassName, componentId, updatePosition])
  useEffect(() => {
    if(containerDomRef.current) updatePosition()
  }, [containerSize.width, componentId, updatePosition])

  /** 父级组件的路径展示 */
  const parentComponents = useMemo(() => {
    const parentComponents: Component[] = []
    if(!selectedComponent) return parentComponents

    let currentComponent: Component | null = selectedComponent

    while(currentComponent?.parentId) {
      const parent = getComponentById(currentComponent.parentId, components)
      if(parent) {
        parentComponents.push(parent)
        currentComponent = parent
      }else {
        currentComponent = null
      }
    }
    return parentComponents
  }, [selectedComponent, components])

  const poralDom = useMemo(() => {
    if(portalWrapper) return portalWrapper

    const dom = document.createElement('div')
    dom.className = 'wrapper'
    const parent = document.querySelector(`.${containerClassName}`)
    if(parent) {
      parent.appendChild(dom)
    }
    return dom
  }, [portalWrapper, containerClassName])

  const currentComponent = useMemo(() => getComponentById(componentId, components), [components, componentId])

  return createPortal(
    <>
      {/* 高亮边框 */}
      <div
        className={`absolute z-[12] bg-[rgba(0,0,255,.1)] border-[1px] border-dashed border-[blue] rounded-[4px] box-border pointer-events-none`}
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
        }}
      />
      {/* 自定义label */}
      <div
        className={`absolute text-[14px] z-[13] translate-x-[-100%] translate-y-[-100%]`}
        style={{
          top: position.labelTop,
          left: position.labelLeft,
          display: (!position.width || position.width < 10)? "none" : "inline",
        }}
        onClick={handleNoBubbleClick}
      >
        <Space>
          <Dropdown
            menu={{
              items: parentComponents.map(item => ({
                key: item.id,
                label: item.desc,
              })),
              onClick: ({ key }) => {
                addSelectedComponent(Number(key))
              }
            }}
            disabled={!parentComponents.length}
          >
            <div
              className='px-[8px] bg-[blue] rounded-[4px] text-[#fff] cursor-pointer whitespace-nowrap'
            >{currentComponent?.desc}</div>
          </Dropdown>
          {
            selectedComponentId && selectedComponentId !== 1 && (
              <div className='px-[8px] bg-[blue] rounded-[4px]'>
                <Popconfirm
                  title="确认删除？"
                  okText={'确认'}
                  cancelText={'取消'}
                  onConfirm={handleDeleteComponent}
                >
                  <DeleteOutlined style={{ color: '#fff' }}/>
                </Popconfirm>
              </div>
            )
          }
        </Space>
      </div>
    </>, poralDom
  )
}

export default memo(SelectedMask)