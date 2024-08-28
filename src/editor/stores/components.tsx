/* 
  zustand的状态管理
*/
import { CSSProperties } from 'react';
import { create } from 'zustand'

/** GoToLink绑定事件的参数 */
export type GoToLinkValue = { 
  /** 跳转的路径 */
  url: string 
};

export type ShowMessageSelectValue = { 
  /** message类型 */
  messsageMethod: string 
};
export type ShowMessageInputValue = { 
  /** message文本 */
  messsageContent: string 
};
/** ShowMessage绑定事件的参数 */
export type ShowMessageValue = ShowMessageSelectValue & ShowMessageInputValue;

/** CustomJS绑定事件的参数 */
export type CustomJSValue = { 
  /** 自定义的代码 */
  code: string 
};

export interface ActionItem extends 
  Partial<GoToLinkValue>,
  Partial<ShowMessageValue>,
  Partial<CustomJSValue>
{
  type: string;
  [key: string]: any;
}
export interface EventConfigProps {
  actions?: ActionItem[]
}

export interface ComponentProps extends EventConfigProps {
  // 绑定点击事件时可能用到的参数
  [key: string]: unknown;
}

export interface Component {
  /** 组件的id标识 */
  id: number;
  /** 组件的名称 */
  name: string;
  /** 组件的props 自定义事件会绑定到这里 */
  props: ComponentProps;
  children?: Component[];
  parentId?: number;
  /** 组件的描述 展示用 */
  desc?: string;
  /** 自定义样式 */
  styles?: CSSProperties
}

interface State {
  components: Component[];
  /** 当前的状态是编辑还是预览 */
  status: 'editing' | 'preview';
  selectedComponentId?: number;
  selectedComponent?: Component | null
}

type getPropItem<T, K extends keyof T> = Pick<T, K>[K]

interface Action {
  addComponent: (component: Component, parentId: getPropItem<Component, 'parentId'>) => void;
  deleteComponent: (componentId: getPropItem<Component, 'id'>) => void;
  updateComponentProps: (componentId: getPropItem<Component, 'id'>, props: getPropItem<Component, 'props'>) => void;
  addSelectedComponent: (componentId?: getPropItem<Component, 'id'>) => void;
  updateComponentStyles: (componentId: getPropItem<Component, 'id'>, styles: getPropItem<Component, 'styles'>, isReplace?: boolean) => void,
  changeStatus: (status: getPropItem<State, 'status'>) => void,
}

/**
 * 根据id在components中查找到对应的component
 * @param id 
 * @param components 
 * @returns component
 */
export const getComponentById = (
  id: getPropItem<Component, 'id'> | undefined,
  components: Component[]
): Component | null => {
  if(!id) return null

  for(const componentItem of components) {
    if(componentItem.id === id) return componentItem
    if(componentItem.children && componentItem.children.length) {
      const result = getComponentById(id, componentItem.children)
      if(result !== null) return result
    }
  }
  return null
}

export const useComponentsStore = create<State & Action>(
  (set, get) => ({
    components: [
      {
        id: 1,
        name: 'Page',
        props: {},
        desc: '主页面'
      }
    ],
    status: 'editing',
    selectedComponent: undefined,
    selectedComponentId: undefined,
    changeStatus: (status) => {
      set(() => ({ status }))
    },
    /**
     * 更新自定义样式
     * @param componentId 
     * @param styles 
     */
    updateComponentStyles: (componentId, styles, isReplace) => {
      set(state => {
        const component = getComponentById(componentId, state.components)
        if(component) {
          // 合并会导致 删除后旧的还有保留，可以通过第三个参数来直接替换
          component.styles = isReplace ? styles : { ...component.styles, ...styles }
        }
        return { components: [...state.components] }
      })
    },
    /**
     * 选中component，保存id和component
     * @param componentId 
     */
    addSelectedComponent: (componentId) => {
      set(state => ({
        selectedComponentId: componentId,
        selectedComponent: getComponentById(componentId, state.components),
      }))
    },
    /**
     * 添加一个component
     * 如果有parentId 通过便利找到对应的parentComponent，然后把component插入到子集中
     * 如果没有parentId 直接插入到components中
     * @param component 
     * @param parentId 
     */
    addComponent: (component, parentId) => {
      set((state) => {
        if(parentId) {
          const parentComponent = getComponentById(parentId, state.components)
          
          component.parentId = parentId
          if(parentComponent) {
            (parentComponent.children || (parentComponent.children = [])).push(component)
          }

          return {
            components: [...state.components]
          }
        }
        return {
          components: [...state.components, component]
        }
      })
    },
    /**
     * 通过componentId删除一个component
     * 找到对应的component，再找到父级，在父级的子集中进行删除
     * TODO 默认有一个根父级，所以只需要往父级中删除即可
     * @param componentId 
     * @returns 
     */
    deleteComponent: (componentId) => {
      if(!componentId) return;

      const storeComponent = get().components
      const component = getComponentById(componentId, storeComponent)
      if(component) {
        const parentComponent = getComponentById(component.parentId, storeComponent)
        
        if(parentComponent) {
          parentComponent.children = parentComponent.children?.filter(item => item.id !== componentId)

          set({ components: [...storeComponent] })
        }
      }
    },
    /**
     * 更新component的props
     * 根据componentId找到对应的component，根据props即可
     * @param componentId 
     * @param props 
     */
    updateComponentProps: (componentId, props) => {
      set(state => {
        const component = getComponentById(componentId, state.components)
        if(component) {
          component.props = { ...component.props, ...props }
        }
        return { components: [...state.components] }
      })
    }
  })
)

