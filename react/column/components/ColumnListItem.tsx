import { useContext } from "react"
import Link from "next/link"
import { Button, Card, CardHeader, Typography } from "@mui/material"
import { Column } from "@/react/column"
import { Member } from "@/react/members"
import { Item } from "@/react/item"
import { ProjectContext } from "@/react/project"
import { FxThemeContext } from "@/fx/theme"


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
    </Card>
  )
}

export default ColumnListItem

// QA: Brian Francisc 10-25-23