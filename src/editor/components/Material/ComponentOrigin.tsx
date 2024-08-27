import { FC, memo, useMemo } from 'react'
import MonacoEditor, { OnChange, OnMount } from '@monaco-editor/react'
import { useComponentsStore } from '@/editorStore/components'
import { useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import styleParser from 'style-to-object'

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

/** 展示区组件的源码 */
const ComponentOrigin: FC = () => {

  const { components, selectedComponent, updateComponentStyles } = useComponentsStore()

  const editorValue = useMemo(() => 
    JSON.stringify(selectedComponent || components, null, 2)
  , [selectedComponent, components])

  const handleEditorMount: OnMount = useMemoizedFn((editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    });
  })

  const handleEditorChange: OnChange = useMemoizedFn(debounce((value) => {
    const { styles, id } = (JSON.parse(value) as Record<string, unknown>) || {}
    if(styles) {
      const css: Record<string, any> = {}
      const stylesStr = JSON.stringify(styles).replace(/[{,}]/g, '')
      styleParser(stylesStr, (name, value) => {
        // 小驼峰
        css[name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))] = value;
      });
      updateComponentStyles(id as number, styles, true)
    }
  }, 500))

  return (
    <MonacoEditor
      height={'100%'}
      path='components.json'
      language='json'
      onMount={handleEditorMount}
      value={editorValue}
      onChange={handleEditorChange}
      options={ediotrOptions}
    />
  )
}

export default memo(ComponentOrigin)