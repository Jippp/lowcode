/* 
  该组件是用来查找某个元素的width、height以及位置信息的
  根据这些信息来创建一个覆盖在该元素之上的边框
  最后通过createPoral创建边框元素 并挂载到父级元素之下。
*/
import { FC, memo, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom';
import { getComponentById, useComponentsStore } from '@/editorStore/components'
import useDomPosition from '../useDomPosition';
import { HoverMaskProps } from '../interface'

/** label高度 */
const labelHeight = 20

const HoverMask: FC<HoverMaskProps> = ({ containerClassName, componentId, portalWrapper }) => {

  const { components } = useComponentsStore()

  const { position, updatePositionHandler } = useDomPosition()

  useEffect(() => {
    updatePositionHandler({ componentId, containerClassName, labelHeight })
  }, [containerClassName, componentId, components, updatePositionHandler])

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

  const currentComponent = useMemo(() => 
    getComponentById(componentId, components)
  , [componentId, components])

  return createPortal((
    <>
      {/* 高亮边框 */}
      <div 
        className={
          `absolute
        bg-[rgba(0,0,255,.1)] border-[1px] border-dashed border-[blue]
          z-[12] rounded-[4px] box-border
          pointer-events-none
          `
        }
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
        }}
      />
      {/* 右上角的label */}
      <div
        className={
          `absolute text-[14px] z-[13] translate-x-[-100%] translate-y-[-100%]`
        }
        style={{
          top: position.labelTop,
          left: position.labelLeft,
          display: (!position.width || position.width < 10) ? "none" : "inline",
        }}
      >
        <div
          className='px-[8px] bg-[blue] rounded-[4px] text-[#fff] cursor-pointer whitespace-nowrap'
        >
          {currentComponent?.desc}
        </div>
      </div>
    </>
  ), poralDom)
}

export default memo(HoverMask)