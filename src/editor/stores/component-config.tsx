// 物料 component名称到Component实例的映射

import { create } from 'zustand'
import Container from '@/editor/materials/Container'
import Button, { ButtonProps } from '@/editor/materials/Button'
import Page from '@/editor/materials/Page'

// 物料中组件的定义
interface ComponentConfig {
  name: string;
  defaultProps: Record<string, any>,
  component: unknown
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
      component: Page
    },
    'Container': {
      name: 'Container',
      defaultProps: {},
      component: Container
    },
    'Button': {
      name: 'Button',
      defaultProps: {
        type: 'primary',
        text: '点击'
      } as ButtonProps,
      component: Button
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
