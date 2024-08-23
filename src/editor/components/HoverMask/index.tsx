/* 
  该组件是用来查找某个元素的width、height以及位置信息的
  根据这些信息来创建一个覆盖在该元素之上的边框
  最后通过createPoral创建边框元素 并挂载到父级元素之下。
*/
import { FC, memo, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom';
import { useMemoizedFn } from 'ahooks';
import { useImmer } from 'use-immer'
import { getComponentById, useComponentsStore } from '@/editorStore/components'

interface HoverMaskProps {
  containerClassName: string;
  componentId: number;
  /** 挂载protal的元素 */
  portalWrapper?: HTMLElement;
}

/** label高度 */
const labelHeight = 20

const defaultPosition = {
  /* 边框位置信息 */
  left: 0,
  top: 0,
  /* 边框大小信息 */
  width: 0,
  height: 0,
  /* label的位置信息 */
  labelLeft: 0,
  labelTop: 0,
}

const HoverMask: FC<HoverMaskProps> = ({ containerClassName, componentId, portalWrapper }) => {

  const [position, updatePosition] = useImmer(defaultPosition)

  const { components } = useComponentsStore()

  const updatePositionHandler = useMemoizedFn(({
    containerClassName, componentId
  }: Pick<HoverMaskProps, 'componentId' | 'containerClassName'>) => {
    const parent = document.getElementsByClassName(containerClassName)[0]
    if(!parent) return

    const dom = parent.querySelector(`[data-component-id="${componentId}"]`)
    if(!dom) return

    const { left, top, width, height } = dom.getBoundingClientRect()
    const { left: parentLeft, top: parentTop } = parent.getBoundingClientRect()

    const labelLeft = left - parentLeft + width
    let labelTop = top - parentTop + parent.scrollTop
    // 被遮挡
    if (labelTop <= labelHeight) {
      labelTop += labelHeight;
    }

    updatePosition(d => {
      d.width = width
      d.height = height
      d.left = left - parentLeft + parent.scrollLeft
      d.top = top - parentTop + parent.scrollTop
      /* label定位到框的右上角 */
      d.labelLeft = labelLeft
      d.labelTop = labelTop
    })
  })

  useEffect(() => {
    updatePositionHandler({ componentId, containerClassName })
  }, [containerClassName, componentId, updatePositionHandler])

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
          {currentComponent?.name}
        </div>
      </div>
    </>
  ), poralDom)
}

export default memo(HoverMask)