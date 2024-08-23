import { FC, memo } from 'react'
import { Button as AntdButton } from 'antd'
import { ButtonType } from 'antd/es/button';
import { ComponentWithChildren } from '@/editor/interface'

export interface ButtonProps extends ComponentWithChildren {
  text: string;
  type: ButtonType
}

const Button: FC<ButtonProps> = ({ id, type, text }) => {
  return (
    <AntdButton data-component-id={id} type={type}>{text}</AntdButton>
  )
}

export default memo(Button)