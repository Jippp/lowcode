/* 
  zustand的状态管理
*/

import { create } from 'zustand'

export interface Component {
  /** 组件的id标识 */
  id: number;
  /** 组件的名称 */
  name: string;
  /** 组件的props */
  props: Record<string, unknown>;
  children?: Component[];
  parentId?: number;
  /** 组件的描述 */
  desc?: string;
}

interface State {
  components: Component[]
}

type getPropItem<T, K extends keyof T> = Pick<T, K>[K]

interface Action {
  addComponent: (component: Component, parentId: getPropItem<Component, 'parentId'>) => void;
  deleteComponent: (componentId: getPropItem<Component, 'id'>) => void;
  updateComponentProps: (componentId: getPropItem<Component, 'id'>, props: getPropItem<Component, 'props'>) => void
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

          // TODO storeComponet和get().components 引用有区别？
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

