import { useContext, useEffect, useState } from "react"
import Link from "next/link"
import { Box, Button, Card, CardContent, CardHeader, Chip, Tooltip,
  Typography } from "@mui/material"
import ChecklistIcon from '@mui/icons-material/Check'
import { ProjectContext } from "@/react/project"
import { FxThemeContext } from "@/fx/theme"
import { AssessmentTypes, AssessmentValues } from "@/react/assessments"
import { Item } from "@/react/item/item-types"


export interface ColumnListProps { item: Item}

const ColumnListItem = ({item}: ColumnListProps) => {

  const {project, setItemDialogIsOpen, setSelectedItem} = useContext(ProjectContext)
  const {fxTheme: fx} = useContext(FxThemeContext)

  const openItemDialog = () => {
    if(!setItemDialogIsOpen) return
    if(!setSelectedItem) return
    setSelectedItem(item.id)
    setItemDialogIsOpen(true)
  }


  const textColor = fx.theme.palette.text.primary
  const itemDirectory = `/member/projects/${project.id}/items/`

  const {LOW, MED, HIGH} = AssessmentValues
  const {PRIORITY, WORTH, SIMPLICITY } = AssessmentTypes
  const types = [PRIORITY, WORTH, SIMPLICITY]

  const getTempratureColor = (value: AssessmentValues | undefined) => {
    switch (value) {
    case LOW: return 'info.light'
    case MED: return 'info.main'
    case HIGH: return 'info.dark'
    default: return ''
    }
  }

  const [checkboxes, setCheckboxes] = useState<boolean[]>([])

  useEffect(() => {
    item.sections?.forEach((s) => {
      if(s.checkboxes){
        const cbs = s.checkboxes.map((c) => c.value)


        setCheckboxes(cbs)
      }
    })


  }, [item, setCheckboxes])


  return (

    <Card >
      <CardHeader
        sx={{p: 0}}
        title={
          setItemDialogIsOpen ?
            <Button onClick={() => openItemDialog()} sx={{color:textColor, width: "100%"}}>
              {item.title}
            </Button>
            :
            <Link href={`${itemDirectory}${item.id}`} style={{color: textColor}}>
              <Typography>{item.title}</Typography>
            </Link>
        }

      />
      {
        (item.simplicity || item.priority || item.worth) && (
          <CardContent sx={{p: 0, m: 0, ml: '3px', '&:last-child': {p: 0}}}>
            {
              checkboxes.length > 0 && (
                <Box sx={{ display: 'flex',
                  justifyContent: 'center',
                  width: '100%',}}>
                  <Typography variant={'caption'}>
                    { ` ${checkboxes.filter((c) => c).length} / ${checkboxes.length}` }
                  </Typography>
                </Box>


              )
            }
            { types.map((t) => {
              if(item[t] !== undefined) {
                return (
                  <Tooltip title={t} key={t} >
                    <Chip size="small"
                      sx={{bgcolor: getTempratureColor(item[t]), width: '32%',
                        height: '10px', mr: '3px', '&:last-child': {mr: 0}}} />
                  </Tooltip>
                )
              }
              return ''
            } )}
          </CardContent>
        ) }
    </Card>
  )
}

export default ColumnListItem

// QA: Brian Francisc 10-25-23