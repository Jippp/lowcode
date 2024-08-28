import { FC, memo, useMemo, useRef, useState } from 'react'
import { Modal, Segmented } from 'antd'
import { useMemoizedFn } from 'ahooks'
import { unionBy } from 'lodash-es'
import { 
  useComponentsStore, 
  EventConfigProps, 
  ActionItem,
  GoToLinkValue, ShowMessageValue
} from '@/editorStore/components'
import GoToLink, { GoToLinkOnChange } from '../eventAction/goToLink'
import ShowMessage, { ShowMessageInputOnChange, ShowMessageSelectOnChange } from '../eventAction/showMessage'
import { EventActionEnums } from '../eventAction/interface'

interface ActionModalProps {
  visible: boolean;
  eventName: string;
  onOk: (actions: ActionItem[]) => void;
  closeModal: () => void;
}

const segmentConfig = ['跳转链接', '消息提示', '自定义JS']
const defaultGoToLink: GoToLinkValue = { url: '' }
const defaultShowMessage: ShowMessageValue = { messsageContent: '', messsageMethod: '' }

/** 绑定事件的弹窗 */
const ActionModal: FC<ActionModalProps> = ({
  visible, eventName, onOk, closeModal
}) => {
  const [selectedKey, setSelectedKey] = useState(segmentConfig[0])
  // 记录事件绑定的一些参数
  const goToLinkValueRef = useRef(defaultGoToLink)
  const showMessageValueRef = useRef(defaultShowMessage)

  const { selectedComponent } = useComponentsStore()

  const selectedComponentProps = useMemo(() => selectedComponent?.props, [selectedComponent?.props])
  const eventActions = useMemo(() => (selectedComponentProps?.[eventName] as EventConfigProps)?.actions || [], [selectedComponentProps, eventName])

  const eventActionsMap = useMemo(() => eventActions.reduce((map, item) => {
    map[item.type as EventActionEnums] = item
    return map
  }, {
    [EventActionEnums.GoToLink]: {} as ActionItem,
    [EventActionEnums.ShowMessage]: {} as ActionItem,
  }), [eventActions])
  // 更新
  if(!goToLinkValueRef.current.url) {
    goToLinkValueRef.current = { url: eventActionsMap[EventActionEnums.GoToLink].url! }
  }
  if(!showMessageValueRef.current.messsageContent) {
    showMessageValueRef.current = { 
      messsageContent: eventActionsMap[EventActionEnums.ShowMessage].messsageContent!, 
      messsageMethod: eventActionsMap[EventActionEnums.ShowMessage].messsageMethod! 
    }
  }

  const handleSgementedChange = useMemoizedFn((value: string) => {
    setSelectedKey(value)
  })

  /** GoToLink组件变动后触发 */
  const handleGoToLinkChange: GoToLinkOnChange = useMemoizedFn((goToLinkValue) => {
    goToLinkValueRef.current = goToLinkValue
  })

  /** ShowMessage组件变动后触发 */
  const handleShowMessageSelectChange: ShowMessageSelectOnChange = useMemoizedFn((selectValue) => {
    showMessageValueRef.current.messsageMethod = selectValue.messsageMethod
  })
  /** ShowMessage组件变动后触发 */
  const handleShowMessageInputChange: ShowMessageInputOnChange = useMemoizedFn((selectValue) => {
    showMessageValueRef.current.messsageContent = selectValue.messsageContent
  })

  const handleOnOk = useMemoizedFn(() => {
    const updatedActions: ActionItem[] = []
    // 新建
    if (goToLinkValueRef.current.url) {
      updatedActions.push({ type: EventActionEnums.GoToLink, ...goToLinkValueRef.current })
    }
    if (showMessageValueRef.current.messsageContent && showMessageValueRef.current.messsageMethod) {
      updatedActions.push({ type: EventActionEnums.ShowMessage, ...showMessageValueRef.current })
    }
    // 合并新的和旧的(重复保存新的) 触发外部事件
    onOk(unionBy([...updatedActions, ...eventActions], 'type'))
  })

  /** 关闭弹窗后重置ref */
  const handleReset = useMemoizedFn(() => {
    goToLinkValueRef.current = defaultGoToLink
    showMessageValueRef.current = defaultShowMessage
  })

  return (
    <Modal
      width={800}
      open={visible}
      title='动作配置'
      onOk={handleOnOk}
      onCancel={closeModal}
      onClose={closeModal}
      afterClose={handleReset}
    >
      <Segmented
        block
        value={selectedKey}
        onChange={handleSgementedChange}
        options={segmentConfig}
      />
      <div className='p-[10px]'>
        {selectedKey === segmentConfig[0] && (
          <GoToLink
            actionItem={eventActionsMap[EventActionEnums.GoToLink]}
            onChange={handleGoToLinkChange}
          />
        )}
        {selectedKey === segmentConfig[1] && (
          <ShowMessage
            actionItem={eventActionsMap[EventActionEnums.ShowMessage]}
            selectOnChange={handleShowMessageSelectChange}
            inputOnChange={handleShowMessageInputChange}
          />
        )}
        {selectedKey === segmentConfig[2] && '自定义JS'}
      </div>
    </Modal>
  )
}

export default memo(ActionModal)