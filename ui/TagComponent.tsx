import { useState } from "react";

import Link from "next/link"
import axios from "axios";
import { useSnackbar } from "notistack";

import { Box, Card, CardHeader, Grid, IconButton, Typography, useTheme } from "@mui/material";
import AddItemIcon from '@mui/icons-material/PostAdd';

import { Tag } from "../interfaces/TagInterface";
import { TagItems, getTagItems } from "../interfaces/TagItems";
import ItemFormDialog from "../components/items/ItemFormDialog";
import FormModes from "../enums/FormModes";
import { Item } from "../interfaces/ItemInterface";

export interface TagComponentProps {
  tag: Tag ;
  tagItems: TagItems[];
}

const TagsComponent = (props: TagComponentProps) => {
  const {tag} = props
  const {enqueueSnackbar} = useSnackbar()

  const [tagItems, setTagItems] = useState(props.tagItems)

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([tag.id])

  const theme = useTheme()

  let medCols = 12;
  let lgCols = 12;

  if(tagItems.length === 2){
    lgCols = 6
  }else if(tagItems.length > 2){
    medCols = 6
    lgCols = 4
  }

  const [addItemDialogIsOpen, setAddItemDialogIsOpen] = useState<boolean>(false)

  const handleCloseDialog = () => {
    setAddItemDialogIsOpen(false)

    axios.get(`/api/items/tags/${tag.id}`).then((res) => {
      if(res.status === axios.HttpStatusCode.Ok){
        setTagItems(getTagItems(tag, res.data.items))
      }else{
        enqueueSnackbar(`Error getting Tagged Items1: ${res.data.message}`, {variant: "error"})
      }
    }).catch((error) => {
      enqueueSnackbar(`Error getting Tagged Items2: ${error}`, {variant: "error"})
    })
    setSelectedTagIds([tag.id])
  }

  const handleOpenDialog = (tagId?: string ) => {
    if(tagId){

      setSelectedTagIds([tag.id, tagId])
    }
    setAddItemDialogIsOpen(true)
  }

  return (
    <Box sx={{mt: 8, p: 3}}>
      <Box sx={{ display: 'flex'}}>
        <Typography
          variant={'h1'}
          sx={{ fontWeight: '800', pl: 3, fontSize: '3rem'}}
          gutterBottom={true}
        >
          {tag.title}
        </Typography>
        <Box>

          <IconButton onClick={ () => handleOpenDialog()} sx={{ ml: 3}} >
            <AddItemIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ height: "100%"}}>
        {
          tagItems.length === 0 && (
            <Typography sx={{pl: 7, pt: 4}}>Content Comming soon.</Typography>
          )
        }
        {
          tagItems.map((ti: TagItems) => (
            <Grid item xs={12} md={medCols} lg={lgCols} key={ti.tag.id}>
              <Card sx={{height: "100%"}}>
                <CardHeader
                  title={ti.tag.title}
                  sx={{bgcolor: "primary.main", color: "primary.contrastText",}}
                  action={
                    <IconButton onClick={ () => handleOpenDialog(ti.tag.id)} sx={{ ml: 3}} >
                      <AddItemIcon sx={{color: 'primary.contrastText'}}/>
                    </IconButton>
                  }
                />
                <ul>{
                  ti.items.map( (i: Item, ) => (
                    <li key={i.id}>
                      <Link
                        href={`/items/${i.id}`}
                        style={{textDecoration: "none", color: theme.palette.text.primary}} >
                        {i.title}
                      </Link>
                    </li>)
                  )
                }</ul>
              </Card>
            </Grid>
          ))
        }

      </Grid>
      <ItemFormDialog
        mode={FormModes.ADD}
        dialogIsOpen={addItemDialogIsOpen}
        closeDialog={handleCloseDialog}
        tagIds={selectedTagIds}
      />
    </Box>
  )
}

export default TagsComponent