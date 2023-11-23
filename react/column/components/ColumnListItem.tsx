import { useContext } from "react"
import Link from "next/link"
import { Button, Card, CardContent, CardHeader, Chip, Tooltip, Typography } from "@mui/material"
import { Item } from "@/react/item"
import { ProjectContext } from "@/react/project"
import { FxThemeContext } from "@/fx/theme"
import { AssessmentTypes, AssessmentValues } from "@/react/assessments"


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

  const getBgColor = () => {
    if(fx.theme.palette.mode === 'light') return 'secondary.main'
    return ''
  }

  const getTextColor = () => {
    if(fx.theme.palette.mode === 'light') return 'secondary.contrastText'
    return 'secondary.main'
  }

  const textColor = fx.theme.palette.text.primary
  const itemDirectory = `/member/projects/${project.id}/items/`

  const {LOW, MED, HIGH} = AssessmentValues
  const {WORTH, COMPLEXITY, PRIORITY} = AssessmentTypes
  const types = [WORTH, COMPLEXITY, PRIORITY]

  const getTempratureColor = (value: AssessmentValues | undefined) => {
    switch (value) {
    case LOW: return 'primary.light'
    case MED: return 'primary.dark'
    case HIGH: return 'primary.main'
    default: return ''
    }
  }

  return (

    <Card sx={{bgcolor: getBgColor}}>
      <CardHeader
        title={
          setItemDialogIsOpen ?
            <Button onClick={() => openItemDialog()} sx={{color: getTextColor(), width: "100%"}}>
              {item.title}
            </Button>
            :
            <Link href={`${itemDirectory}${item.id}`} style={{color: textColor}}>
              <Typography>{item.title}</Typography>
            </Link>
        }
      />
      {
        (item.complexity || item.priority || item.worth) && (
          <CardContent sx={{p: 0, m: 0, ml: '3px', '&:last-child': {p: 0}}}>
            { types.map((t) => {
              if(item[t] !== undefined) {
                return (
                  <Tooltip title={t} key={t}>
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