import { FC, memo } from 'react'
import { ComponentWithChildren } from '@/editor/interface'
import useMaterialDrop from '@/editor/hooks/useMaterialDrop'

interface ModalProps extends ComponentWithChildren {
  title: string;
  open: boolean;
  closeModal: () => void;
  onOk: () => void;
}

const Modal: FC<ModalProps> = ({
  title, id, styles, children
}) => {

  const [{ canDrop }, modalRef] = useMaterialDrop({
    id, accept: ['Button', 'Container', 'Modal']
  })

  return (
    <div
      ref={modalRef}
      style={styles}
      data-component-id={id}
      className={`min-h-[100px] p-[20px] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`}
    >
      <h4>{title}</h4>
      <div>
        {children}
      </div>
    </div>
  )
}

export default memo(Modal)