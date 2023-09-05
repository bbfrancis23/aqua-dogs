import { useState, useContext } from "react";
import Link from "next/link"

import { Button, Card, CardHeader, IconButton, Typography, useTheme } from "@mui/material";

import { Column } from "@/interfaces/ColumnInterface";
import { Member } from "@/interfaces/MemberInterface";
import { Item } from "@/interfaces/ItemInterface";
import { ProjectContext } from "@/interfaces/ProjectInterface";

import EditItemForm from "./forms/EditItemForm";
import { FxTheme } from "theme/globalTheme";


export interface ColumnListProps {
  column: Column;
  member: Member;
  item: Item;
}

const ColumnListItem = (props: ColumnListProps) => {
  const {column, member, item} = props

  const {project, setItemDialogIsOpen, setSelectedItem} = useContext(ProjectContext)

  const theme: FxTheme = useTheme()

  const handleOptenItemDialog = () => {
    if(!setItemDialogIsOpen) return
    if(!setSelectedItem) return
    setSelectedItem(item.id)

    setItemDialogIsOpen(true)

  }

  const getBgColor = () => {

    if(theme.palette.mode === 'light'){

      return 'secondary.main'
    }
    return ''

  }

  const getTextColor = () => {

    if(theme.palette.mode === 'light'){

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
              style={{textDecoration: "none", color: theme.palette.text.primary}}>
              <Typography>{item.title}</Typography>
            </Link>
        }
      />
    </Card>
  )

}

export default ColumnListItem

// QA: Brian Francisc 8-12-23