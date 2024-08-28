import { FC, memo } from 'react'
import { Button as AntdButton } from 'antd'
import { ButtonType } from 'antd/es/button';
import { PreviewComponentWithChildren } from '@/editor/interface'

export interface ButtonProps extends PreviewComponentWithChildren {
  text: string;
  type: ButtonType;
}

const Button: FC<ButtonProps> = ({ type, text, styles, ...props }) => {
  return (
    <AntdButton type={type} style={styles} {...props}>{text}</AntdButton>
  )
}

export default memo(Button)