import { FC, memo, useEffect, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import MonacoEditor, { OnChange, OnMount } from '@monaco-editor/react'
import { ActionItem, CustomJSValue } from '@/editor/stores/components' 
import { debounce } from 'lodash-es';

export type CustomJSOnChange = (customJSValue: CustomJSValue) => void;

const ediotrOptions = {
  fontSize: 14,
  scrollBeyondLastLine: false,
  minimap: {
    enabled: false,
  },
  scrollbar: {
    verticalScrollbarSize: 6,
    horizontalScrollbarSize: 6,
  }
}

interface GoToLinkProps {
  actionItem: ActionItem;
  onChange: CustomJSOnChange;
}

const CustomJS: FC<GoToLinkProps> = ({ actionItem, onChange }) => {
  const [editorValue, setEditorValue] = useState('' as string)

  const handleEditorMount: OnMount = useMemoizedFn((editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    });
  })

  const handleEditorChange: OnChange = useMemoizedFn(debounce((value) => {
    setEditorValue(value)

    onChange({ code: value })
  }, 500))

  // 受控
  useEffect(() => {
    setEditorValue(actionItem?.code as string)
  }, [actionItem])
  
  return (
    <div className='flex items-center gap-[10px] mt-[10px]'>
      <div>自定义JS</div>
      <div>
        <MonacoEditor 
          width={'600px'}
          height={'380px'}
          path='action.js'
          language='javascript'
          options={ediotrOptions}
          onMount={handleEditorMount}
          value={editorValue}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  )
}

export default memo(CustomJS)