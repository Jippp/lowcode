import { PropsWithChildren } from 'react'
import { Component } from '@/editorStore/components'

// store/components中定义的
export interface ComponentWithChildren extends 
  PropsWithChildren, 
  Pick<Component, 'id' | 'name'>  
{
  [key: string]: unknown
}

/** drop时传递的信息 */
export interface DragObject {
  type: Pick<Component, 'name'>['name']
}

export interface CollectedProps {
  canDrop: boolean
}
