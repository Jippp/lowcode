// 物料 component名称到Component实例的映射

import { create } from 'zustand'
import Container from '@/editor/materials/Container'
import Button, { ButtonProps } from '@/editor/materials/Button'
import Page from '@/editor/materials/Page'

// settint区域form表单展示，这里定义了一些配置
export interface ComponentSetter {
  /** 组件名称 */
  name: string;
  /** form.item.label属性 */
  label: string;
  /** 可交互类型 如select选择、input输入框 */
  type: string;
  /** 其他一些用来传递给自定义组件的参数 */
  [key: string]: any;
}

// 物料中组件的定义
export interface ComponentConfig {
  name: string;
  defaultProps: Record<string, any>,
  component: unknown;
  /** 描述 */
  desc: string;
  /** 可交互的配置 */
  setter?: ComponentSetter[];
  /** css央视可交互的配置 */
  stylesSetter?: ComponentSetter[];
}

interface State {
  componentConfig: {
    [key: string]: ComponentConfig
  }
}

interface Action {
  registerComponent: (
    name: string,
    componentConfig: ComponentConfig
  ) => void
}

export const useComponentConfigStore = create<State & Action>(set => ({
  componentConfig: {
    'Page': {
      name: 'Page',
      defaultProps: {},
      component: Page,
      desc: '主页面',
    },
    'Container': {
      name: 'Container',
      defaultProps: {},
      component: Container,
      desc: '容器',
    },
    'Button': {
      name: 'Button',
      defaultProps: {
        type: 'primary',
        text: '点击'
      } as ButtonProps,
      component: Button,
      desc: '按钮',
      setter: [
        {
          name: 'type',
          label: '按钮类型',
          type: 'select',
          options: [
            {label: '主按钮', value: 'primary'},
            {label: '次按钮', value: 'default'},
          ]
        },
        {
          name: 'text',
          label: '文本',
          type: 'input',
        }
      ],
      stylesSetter: [
        {
          name: 'width',
          label: '宽度',
          type: 'inputNumber'
        },
        {
          name: 'height',
          label: '高度',
          type: 'inputNumber'
        },
      ]
    }
  },
  /**
   * 添加一个component到Component的映射
   * @param name 
   * @param componentConfig 
   */
  registerComponent: (name, componentConfig) => set(state => {
    return {
      ...state,
      componentConfig: {
        ...state.componentConfig,
        [name]: componentConfig
      }
    }
  })
}))
