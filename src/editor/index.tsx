import { FC, memo } from 'react'
import { Allotment } from 'allotment'
import 'allotment/dist/style.css'
import Header from './components/Header'
import EditArea from './components/EditArea'
import Material from './components/Material'
import Setting from './components/Setting'
import Preview from './components/Preview'
import { useComponentsStore } from '@/editorStore/components'

const Editor: FC = () => {

  const { status } = useComponentsStore()

  return (
    <div className='h-[100vh] flex flex-col'>
      <div className="h-[60px] flex items-center border-b-[1px] border-[#ccc]">
        <Header />
      </div>
      {
        status === 'preview' ? <Preview /> : (
          <Allotment>
            <Allotment.Pane preferredSize={240} maxSize={500} minSize={200}>
              <Material />
            </Allotment.Pane>
            <Allotment.Pane>
              <EditArea />
            </Allotment.Pane>
            <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
              <Setting />
            </Allotment.Pane>
          </Allotment>
        )
      }
    </div>
  )
}

export default memo(Editor)