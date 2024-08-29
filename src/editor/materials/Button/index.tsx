import { FC, memo } from 'react'
import { useDrag } from 'react-dnd'
import { Button as AntdButton } from 'antd'
import { ButtonType } from 'antd/es/button';
import { ComponentWithChildren, DragObject } from '@/editor/interface'

export interface ButtonProps extends ComponentWithChildren {
  text: string;
  type: ButtonType;
}

const Button: FC<ButtonProps> = ({ id, name, type, text, styles }) => {
  const [_, dragRef] = useDrag<DragObject>({
    type: name,
    item: {
      type: name,
      dragType: 'move',
      dragComponentId: id
    }
  })

  return (
    <AntdButton data-component-id={id} ref={dragRef} type={type} style={styles}>{text}</AntdButton>
  )
}

export default memo(Button)