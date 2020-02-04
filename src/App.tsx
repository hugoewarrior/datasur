import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { ExcelFile } from './manageExcel/excelList'

export const App = (props: any) => {

  const [files, setFiles] = useState([])
  const excel = new ExcelFile()


  useEffect(() => console.log(excel.working), [excel.working])


  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles)
  }, [])

  const loadFiles = async () => {
    excel.readmultifiles(files).then((e: any) => excel.normalizeFiles(e))
  }

  const deleteFiles = () => {
    setFiles([])
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div>
      <div
        style={
          {
            minHeight: 500,
            display: 'flex',
            flex: 3,
            flexDirection: 'column',
            backgroundColor: '#24292e'
          }
        }
        {...getRootProps()}>
        <input {...getInputProps()} />
        <div
          style={{
            textAlign: 'center',
            padding: '5%'
          }}
        >
          {
            isDragActive ?

              <p style={{ color: 'white' }}>Drop the files here ...</p> :
              <p style={{ color: 'white' }}>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
        <div>
          {files.length > 0 ? files.map((f: any, key: number) =>
            <div
              key={key}
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'row',
                padding: '3%', color: 'white'
              }} >
              <div style={{
                flex: 3, float: 'left'
              }}>
                {f.name}
              </div>
              <div style={{
                flex: 1, float: 'right'
              }}>
                {key}
              </div>
            </div>
          ) :
            <div style={{
              flex: 1, textAlign: 'center',
              padding: '10%', color: 'red'
            }}
            >NO files added yet </div>}
        </div>

      </div>

      <button disabled={files.length < 1} onClick={loadFiles} >
        Process Files
      </button>

      <button disabled={files.length < 1} onClick={deleteFiles} >
        Clear Files
      </button>
    </div>

  )
}