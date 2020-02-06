import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { ExcelFile } from './manageExcel/excelList'
import {
  Grid, makeStyles, createStyles, Theme,
  ButtonGroup, Button, ListItem, ListItemIcon,
  ListItemText, Typography, Divider, IconButton,
  Tooltip, Backdrop, CircularProgress, Snackbar, Slide
} from '@material-ui/core'
import { GenericAppBar } from './_utils/appbar'
import { NoteAdd, FileCopy, Clear } from '@material-ui/icons'
import { TransitionProps } from '@material-ui/core/transitions';

const SlideTransition = (props: TransitionProps) => <Slide {...props} direction="up" />


export const App = (props: any) => {

  const [files, setFiles] = useState([])
  const [working, setWorking] = useState(false)
  const [snackMessage, setMessage] = useState('' as string)
  const [results, setResults] = useState([])
  const excel = new ExcelFile()


  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles);
  }, [])

  const loadFiles = async () => {
    setWorking(true);
    excel.readmultifiles(files)
      .then((e: any) => {
        excel.normalizeFiles(e).then((e: any) => {
          if (e.length > 0) {
            setMessage(`${e.length} results found`);
            setResults(e)
          }
          else {
            setMessage(`We re sorry, no results were found`);
            setResults([])
          }
        }).catch((m)=>setMessage(m))
      })
      .finally(() => {
        setWorking(false);
      })
  }

  const exportFile = async () => {
    setWorking(true)
    excel.generateExcelFile(results).then((r) => {
      r ? setMessage("The file was generated succesfuly") :
        setMessage("Error: please try again")
    }).finally(() => setWorking(false))
  }

  const deltedSelected = (row: any) => {
    let f = files.filter((r: any, k: number) => k !== row)
    setFiles(f)
    if (f.length < 1) setResults([])

  }

  const deleteFiles = () => {
    setFiles([])
    setResults([])
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.xlsx'
  });
  const classes = mainAppStyles();

  return (
    <Grid
      container
    >
      <GenericAppBar title={"DataSur A.I."} />
      <Grid item
        xs={12} sm={12} md={12} lg={12} xl={12}
        className={classes.itemRoot}>
        {files.length < 1 ?
          <div
            className={classes.bucket}
            style={{
              borderColor: isDragActive ? "#2196f3" : "#ACB3B3",
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div
              className={classes.centerAwaiter}
            >
              <NoteAdd color={isDragActive ? "primary" : "disabled"} fontSize="large" />
              <p> Drop the files here or Click to search ...</p>
            </div>
          </div> :
          <div className={classes.fileList}>

            <Typography variant="h4"> {`${files.length} elements selected:`} </Typography>
            <Divider style={{
              marginTop: 10, marginBottom: 10
            }} />
            {files.map((row: any, k: number) =>
              <ListItem key={k}>
                <ListItemIcon>
                  <FileCopy />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary={row.name} />
                <Tooltip title={`Delete ${row.name}`} placement="left">
                  <IconButton onClick={() => deltedSelected(k)}>
                    <Clear />
                  </IconButton>
                </Tooltip>
              </ListItem>)}
          </div>}


      </Grid>
      <Grid item
        xs={12} sm={12} md={12} lg={12} xl={12}
        className={classes.buttons}
      >
        <ButtonGroup size="medium">
          <Button variant="contained" color="primary" disabled={files.length < 1} onClick={loadFiles}>Process Files</Button>
          <Button disabled={results.length < 1}
            variant="contained"
            color="primary"
            onClick={exportFile}>
            Download Results
          </Button>
          <Button disabled={files.length < 1} onClick={deleteFiles}>Clear Files</Button>

        </ButtonGroup>
      </Grid>
      <Backdrop className={classes.backdrop} open={working}>
        <Typography variant="caption"> Processing Data, please wait... </Typography>
        <CircularProgress style={{
          textAlign: "center", marginLeft: 10
        }} color="inherit" />
      </Backdrop>
      <Snackbar
        message={snackMessage}
        open={Boolean(snackMessage)}
        autoHideDuration={10000}
        TransitionComponent={SlideTransition}
        action={
          <IconButton color="inherit" onClick={() => setMessage('')}>
            <Clear />
          </IconButton>
        }
      />
    </Grid>

  )
}

const mainAppStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemRoot: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
    bucket: {
      textAlign: "center",
      margin: 20,
      padding: 20,
      borderStyle: "dashed",
      borderColor: "#ACB3B3",
      height: "70vh",
      cursor: "pointer"
    },
    fileList: {
      margin: 20,
      padding: 20,
      height: "65vh",
    },
    centerAwaiter: {
      left: "50%",
      top: "50%",
      position: "absolute",
      transform: "translate(-50%, -50%)",
      textAlign: 'center'
    },
    buttons: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    listItemText: {
      fontSize: '0.9em'
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },


  }),
);
