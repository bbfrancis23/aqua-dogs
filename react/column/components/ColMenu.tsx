import { useState, MouseEvent, useContext } from "react"
import { Box, Button, Fade, IconButton, Menu, MenuItem, MenuList, MenuProps } from "@mui/material"
import MenuIcon from '@mui/icons-material/MoreVert'
import { useSnackbar } from "notistack"
import { useConfirm } from "material-ui-confirm"
import axios from "axios"
import { Column } from "@/react/column"
import { ProjectContext } from "@/react/project"
import { MemberContext } from "@/react/members"
import { BoardContext, ColumnKeyArray } from "@/react/board"
import {Permission, PermissionCodes } from "fx/ui"
import { AssessmentTypes, AssessmentValues } from "@/react/assessments"

export interface ArchiveColumnProps { column: Column}

/* eslint-disable */

const ArchiveColumnForm = ({column}: ArchiveColumnProps) => {

  const {project} = useContext(ProjectContext)
  const {member} = useContext(MemberContext)
  const {board, setBoard} = useContext(BoardContext)
  const {enqueueSnackbar} = useSnackbar()
  const confirm = useConfirm()

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorElement)
  const click = (event: MouseEvent<HTMLButtonElement>) => { setAnchorElement(event.currentTarget) }
  const close = () => setAnchorElement(null)

  const archive = async () => {
    try{
      await confirm({description: `Archive ${column.title}`})
        .then( () => {
          const colPath = `/api/members/projects/${project.id}/boards/${board.id}/columns/`
          axios.delete(`${colPath}${column.id}`)
            .then((res) => {
              enqueueSnackbar(`Archived ${column.title}`, {variant: "success"})
              setBoard(res.data.board)
            }).catch((error) => {
              const msg = `Error Archiving Board: ${error.response.data.message}`
              enqueueSnackbar(msg, {variant: "error"})
            })
        })
        .catch((e) => enqueueSnackbar('Archiving aborted', {variant: "error"}) )
    }catch(e){
      enqueueSnackbar(`Error Archiving ${e}`, {variant: "error"})
    }
  }

  const sortByAssessment = () => {
    const {WORTH, SIMPLICITY, PRIORITY} = AssessmentTypes
    const assessmentTypes = [PRIORITY, WORTH, SIMPLICITY]
    const {LOW, MED, HIGH} = AssessmentValues

    for(const i of column.items) {
      let assessmentScore = 0
      assessmentTypes.forEach( (type) => {
        switch (i[type]) {
        case LOW: assessmentScore += 1; break
        case MED: assessmentScore += 2; break
        case HIGH: assessmentScore += 3; break
        default: break
        }
      })
      i.assessmentScore = assessmentScore
    }

    column.items.sort((a, b) => {
      if(!a.assessmentScore || !b.assessmentScore) return 0
      if(a?.assessmentScore > b?.assessmentScore) return -1
      if(a?.assessmentScore < b?.assessmentScore) return 1
      return 0
    })
    
    const newBoard = {...board, columns: [...board.columns]}
    let colKeys: ColumnKeyArray = {}
    for(const c of newBoard.columns) {      colKeys[c.id] = c    }

    axios.patch(`/api/members/projects/${project.id}/boards/${board.id}`, {boardCols: colKeys} )
    .then((res) => {      
      enqueueSnackbar(`Cards Reordered `, {variant: "success"})
    })
    .catch((e:any) => {
      console.log(e)
      enqueueSnackbar(`Error Moving Cards: ${e}`, {variant: "error"})
    })

    setBoard(newBoard)

  }

  const menu: MenuProps = {
    id: "col-menu",
    anchorEl: anchorElement,
    open,
    onClose: close,
    TransitionComponent: Fade,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'right',
    }
  }

  return (
    <Permission code={PermissionCodes.PROJECT_LEADER} project={project} member={member} >
      <Box>
        <IconButton onClick={click}><MenuIcon /></IconButton>
        <Menu {...menu} >
          <MenuList dense={true} >

            <MenuItem>

              <Button  onClick={() => sortByAssessment()}>
                SORT BY ASSESSMENT
              </Button>
            </MenuItem>
            <MenuItem>
              <Button
                sx={{width: '100%'}} color="error" onClick={() => archive()}>
                ARCHIVE COLUMN
              </Button>

            </MenuItem>
            <MenuItem >
              <Button  sx={{width: '100%'}} onClick={() => close()}>
              CLOSE
              </Button>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Permission>
  )
}

export default ArchiveColumnForm

// QA Brian Francis 10/26/23