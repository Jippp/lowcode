import { ForwardRefRenderFunction, forwardRef, useImperativeHandle } from 'react'
import { Modal as AntdModal } from 'antd'
import { useBoolean } from 'ahooks';
import { PreviewComponentWithChildren } from '@/editor/interface'

interface ModalProps extends PreviewComponentWithChildren {
  title: string;
  onOk: () => void;
}

export interface ModalRef {
  open: () => void
  close: () => void
}

const Modal: ForwardRefRenderFunction<ModalRef, ModalProps> = ({ 
  title, onOk, styles, children
}, ref) => {
  const [visible, { setFalse: closeVisible, setTrue: openVisible }] = useBoolean()

  useImperativeHandle(ref, () => {
    return {
      open: openVisible,
      close: closeVisible
    }
  })

  return (
    <AntdModal 
      style={styles}
      title={title}
      open={visible} 
      onOk={onOk} 
      onCancel={closeVisible}
      destroyOnClose
    >{children}</AntdModal>
  )
}

export default forwardRef(Modal)