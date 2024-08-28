// 物料 component名称到Component实例的映射

import { create } from 'zustand'
import Container from '@/editor/materials/Container'
import ContainerPreview from '@/editor/materials/Container/preview'
import Button, { ButtonProps } from '@/editor/materials/Button'
import ButtonPreview from '@/editor/materials/Button/preview'
import Page from '@/editor/materials/Page'
import PagePreview from '@/editor/materials/Page/preview'

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

export interface EventSetter {
  name: string;
  label: string;
}

// 物料中组件的定义
export interface ComponentConfig {
  name: string;
  defaultProps: Record<string, any>,
  /** 描述 */
  desc: string;
  /** 编辑时的组件 */
  editing: unknown;
  /** 预览时的组件 */
  preview: unknown;
  /** 可交互的配置 */
  setter?: ComponentSetter[];
  /** css样式可交互的配置 */
  stylesSetter?: ComponentSetter[];
  /** 自定义事件的配置 */
  eventSetter?: EventSetter[];
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
      editing: Page,
      preview: PagePreview,
      desc: '主页面',
    },
    'Container': {
      name: 'Container',
      defaultProps: {},
      editing: Container,
      preview: ContainerPreview,
      desc: '容器',
    },
    'Button': {
      name: 'Button',
      defaultProps: {
        type: 'primary',
        text: '点击'
      } as ButtonProps,
      editing: Button,
      preview: ButtonPreview,
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
      ],
      eventSetter: [
        {
          name: 'onClick',
          label: '点击事件'
        },
        {
          name: 'onDoubleClick',
          label: '双击事件'
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
