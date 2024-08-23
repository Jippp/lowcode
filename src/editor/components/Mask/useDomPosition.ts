import { useMemoizedFn } from 'ahooks'
import { useImmer } from 'use-immer'

interface DOMPositionProps {
  /** 容器的类名 */
  containerClassName: string;
  componentId: number;
  /** 上方label的高度 */
  labelHeight: number;
}

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

/**
 * 包裹dom高亮框的计算，默认label是在高亮框右上角，label左上角和高亮框的右上角相连
 * 需要注意，label的宽度不固定，所以需要通过transform来移动lable位置
 */
export default (labelAlign: 'left' | 'right' = 'right') => {
  const [position, updatePosition] = useImmer(defaultPosition)

  const updatePositionHandler = useMemoizedFn(({
    containerClassName, componentId, labelHeight
  }: DOMPositionProps) => {
    const parent = document.getElementsByClassName(containerClassName)[0]
    if(!parent) return

    const dom = parent.querySelector(`[data-component-id="${componentId}"]`)
    if(!dom) return

    const { left, top, width, height } = dom.getBoundingClientRect()
    const { left: parentLeft, top: parentTop } = parent.getBoundingClientRect()

    const labelLeft = left - parentLeft + (labelAlign === 'right' ? width : 0)
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

  return { position, updatePositionHandler }
}