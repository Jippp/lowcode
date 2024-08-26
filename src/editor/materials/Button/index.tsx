import { FC, memo } from 'react'
import { Button as AntdButton } from 'antd'
import { ButtonType } from 'antd/es/button';
import { ComponentWithChildren } from '@/editor/interface'

export interface ButtonProps extends ComponentWithChildren {
  text: string;
  type: ButtonType;
}

const Button: FC<ButtonProps> = ({ id, type, text, styles }) => {
  return (
    <AntdButton data-component-id={id} type={type} style={styles}>{text}</AntdButton>
  )
}

export default memo(Button)