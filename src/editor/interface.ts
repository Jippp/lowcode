import { PropsWithChildren } from 'react'
import { Component } from '@/editorStore/components'

// store/components中定义的
export interface ComponentWithChildren extends 
  PropsWithChildren, 
  Pick<Component, 'id' | 'name' | 'styles'>  
{
  [key: string]: unknown
}

export interface PreviewComponentWithChildren extends 
  PropsWithChildren, 
  Pick<Component, 'name' | 'styles'>  
{
  [key: string]: unknown
}

/** drop时传递的信息 */
export interface DragObject {
  /** 名称 */
  type: Pick<Component, 'name'>['name'];
  /** 类型 移动还是新建 */
  dragType?: 'move' | 'add';
  /** 组件id */
  dragComponentId?: number;
}

export interface CollectedProps {
  canDrop: boolean
}
