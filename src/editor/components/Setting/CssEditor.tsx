import { FC, memo } from 'react'
import MonacoEditor, { OnMount, EditorProps } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useMemoizedFn } from 'ahooks'

export type OnChange = EditorProps['onChange']

export interface CssEditorProps {
  cssValue: string;
  onChange?: OnChange
  options?: editor.IStandaloneEditorConstructionOptions
}

const CSSEditor: FC<CssEditorProps> = (props) => {
  const { cssValue, onChange, options } = props

  // 初始化时触发
  const handleEditorMount: OnMount = useMemoizedFn((editor, monaco) => {
    // 添加一个ctrl+j的快捷指令：格式化
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })
  })

  return (
    <MonacoEditor 
      height='100%'
      language='css'
      path='component.css'
      onMount={handleEditorMount}
      onChange={onChange}
      value={cssValue}
      options={{
        fontSize: 14,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        ...options
      }}
    />
  )
}

export default memo(CSSEditor)