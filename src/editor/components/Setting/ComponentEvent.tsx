import { FC, Fragment, memo, useMemo, useState } from 'react'
import { Button, Collapse } from 'antd'
import { useBoolean, useMemoizedFn } from 'ahooks'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useComponentConfigStore, EventSetter } from '@/editorStore/component-config'
import {
  useComponentsStore,
  ActionItem,
  EventConfigProps,
} from '@/editorStore/components'
import { EventActionEnums, EventActionNameEnums } from './eventAction/interface'
import ActionModal from './ActionModal'

/** 组件事件相关 */
const ComponentEvent: FC = () => {
  const [actionModalVisible, { setFalse: closeActionModal, setTrue: openActionModal }] = useBoolean(false)
  const [currentEventName, setCurrentEventName] = useState('')
  const [currentActionName, setCurrentActionName] = useState(EventActionNameEnums.GoToLink)

  const { selectedComponent, selectedComponentId, updateComponentProps } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const eventSetterConfig = useMemo(() =>
    (selectedComponent ? (componentConfig[selectedComponent.name].eventSetter || []) : []) as EventSetter[]
    , [selectedComponent, componentConfig])

  const selectedComponentProps = useMemo(() => selectedComponent?.props, [selectedComponent?.props])

  /** 确定弹窗内容 */
  const handleModalConfirm = useMemoizedFn((actions: ActionItem[]) => {
    // 更新绑定事件
    updateComponentProps(selectedComponentId!, {
      [currentEventName]: {
        actions
      }
    })
    closeActionModal()
  })

  const handleOpenActionModal = useMemoizedFn((e, eventName: string) => {
    setCurrentEventName(eventName)
    setCurrentActionName(EventActionNameEnums.GoToLink)
    // 阻止冒泡 误触发collapse的展开/收起
    e.stopPropagation()
    openActionModal()
  })

  /** 删除绑定事件 */
  const handleDeleteAction = useMemoizedFn((currentEventProps: EventConfigProps, index: number) => {
    updateComponentProps(selectedComponentId!, {
      [currentEventName]: {
        actions: (currentEventProps?.actions || []).filter((_, idx) => idx !== index)
      }
    })
  })

  const handleEditAction = useMemoizedFn((eventName: string, actionName: EventActionNameEnums) => {
    setCurrentEventName(eventName)
    setCurrentActionName(actionName)
    openActionModal()
  })

  const collapseItem = useMemo(() => {
    return eventSetterConfig.map(event => {
      const currentEventProps = selectedComponentProps?.[event.name] as EventConfigProps
      return {
        key: event.name,
        label: (
          <div className='flex items-center justify-between'>
            {event.label}
            <Button
              type="primary"
              className='h-[100%]'
              size='small'
              ghost
              onClick={(e) => handleOpenActionModal(e, event.name)}
            >动作配置</Button>
          </div>
        ),
        children: (
          <>
            {(currentEventProps?.actions || []).map((action, index) => {
              return (
                <Fragment key={action.type}>
                  {
                    action.type === EventActionEnums.GoToLink ? (
                      <div className='border border-[#aaa] mt-[10px] p-[10px] rounded-[8px] relative'>
                        <div className='text-[blue]'>{EventActionNameEnums.GoToLink}</div>
                        <div>{action.url}</div>
                        <div 
                          className='absolute top-[10px] right-[30px] cursor-pointer'
                          onClick={() => handleEditAction(event.name, EventActionNameEnums.GoToLink)}
                        ><EditOutlined /></div>
                        <div 
                          className='absolute top-[10px] right-[10px] cursor-pointer'
                          onClick={() => handleDeleteAction(currentEventProps, index)}
                        ><DeleteOutlined /></div>
                      </div>
                    ) : null
                  }
                  {
                    action.type === EventActionEnums.ShowMessage ? (
                      <div className='border border-[#aaa] mt-[10px] p-[10px] rounded-[8px] relative'>
                        <div className='text-[blue]'>{EventActionNameEnums.ShowMessage}</div>
                        <div>消息类型: {action.messsageMethod}</div>
                        <div>消息文本: {action.messsageContent}</div>
                        <div 
                          className='absolute top-[10px] right-[30px] cursor-pointer'
                          onClick={() => handleEditAction(event.name, EventActionNameEnums.ShowMessage)}
                        ><EditOutlined /></div>
                        <div 
                          className='absolute top-[10px] right-[10px] cursor-pointer'
                          onClick={() => handleDeleteAction(currentEventProps, index)}
                        ><DeleteOutlined /></div>
                      </div>
                    ) : null
                  }
                  {
                    action.type === EventActionEnums.CustomJS ? (
                      <div className='border border-[#aaa] mt-[10px] p-[10px] rounded-[8px] relative'>
                        <div className='text-[blue]'>{EventActionNameEnums.CustomJS}</div>
                        <pre>{JSON.stringify(action.code, null, 2)}</pre>
                        <div 
                          className='absolute top-[10px] right-[30px] cursor-pointer'
                          onClick={() => handleEditAction(event.name, EventActionNameEnums.CustomJS)}
                        ><EditOutlined /></div>
                        <div 
                          className='absolute top-[10px] right-[10px] cursor-pointer'
                          onClick={() => handleDeleteAction(currentEventProps, index)}
                        ><DeleteOutlined /></div>
                      </div>
                    ) : null
                  }
                </Fragment>
              )
            })}
          </>
        )
      }
    })
  }, [eventSetterConfig, selectedComponentProps, handleOpenActionModal, handleEditAction, handleDeleteAction])

  if (!selectedComponent) return null

  return (
    <>
      <Collapse 
        items={collapseItem}
        defaultActiveKey={componentConfig[selectedComponent.name].eventSetter?.map(item => item.name)}  
      />
      <ActionModal
        visible={actionModalVisible}
        closeModal={closeActionModal}
        onOk={handleModalConfirm}
        eventName={currentEventName}
        actionName={currentActionName}
      />
    </>
  )
}

export default memo(ComponentEvent)