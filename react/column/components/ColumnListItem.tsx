import { useState, useContext } from "react";
import Link from "next/link"

import { Button, Card, CardHeader, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Column } from "@/react/column/column-types";
import { Member } from "@/react/members/member-types";
import { Item } from "@/react/item/item-types";
import { ProjectContext } from "@/react/project/";
import { FxThemeContext } from "@/fx/theme";


export interface ColumnListProps {
  column: Column;
  member: Member;
  item: Item;
}

const ColumnListItem = (props: ColumnListProps) => {
  const {column, member, item} = props

  const {project, setItemDialogIsOpen, setSelectedItem} = useContext(ProjectContext)

  const {fxTheme: fx} = useContext(FxThemeContext)

  const handleOptenItemDialog = () => {
    if(!setItemDialogIsOpen) return
    if(!setSelectedItem) return
    setSelectedItem(item.id)

    setItemDialogIsOpen(true)

  }

  const getBgColor = () => {

    if(fx.theme.palette.mode === 'light'){

      return 'secondary.main'
    }
    return ''

  }

  const getTextColor = () => {

    if(fx.theme.palette.mode === 'light'){

      return 'secondary.contrastText'
    }
    return 'secondary.main'
  }

  return (

    <Card sx={{bgcolor: getBgColor}}>
      <CardHeader
        title={
          setItemDialogIsOpen ?
            <Button onClick={() => handleOptenItemDialog()}
              sx={{color: getTextColor(), width: "100%"}}>
              {item.title}
            </Button>
            :
            <Link href={`/member/projects/${project.id}/items/${item.id}`}
              style={{textDecoration: "none", color: fx.theme.palette.text.primary}}>
              <Typography>{item.title}</Typography>
            </Link>
        }
      />
    </Card>
  )

}

export default ColumnListItem

// QA: Brian Francisc 8-12-23