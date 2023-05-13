import { Card, CardHeader, Grid, IconButton, useTheme } from "@mui/material"

import AddItemIcon from '@mui/icons-material/PostAdd';

import { Draggable } from "react-beautiful-dnd";
import { Org } from "../../interfaces/OrgInterface";
import TagBoardColList from "./TagBoardColList";

export interface BoardColProps{
  medCols: number;
  lgCols: number;
  id: string;
  tagItem: any;
  index: number;
  org?: Org;
  setItemFormDialogOpen: (tagId ?:string) => void
}

const TagBoardCol = (props: BoardColProps) => {
  const {medCols, lgCols, id, tagItem, index, org, setItemFormDialogOpen} = props


  const theme = useTheme()

  const linkPath = org ? `/member/orgs/${org.id}/items` : '/items'

  console.log('here is the id', tagItem.tag.id)

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Grid item xs={12} md={medCols} lg={lgCols} key={id}
          ref={provided.innerRef} {...provided.draggableProps}>
          <Card sx={{height: "100%"}}>
            <CardHeader
              {...provided.dragHandleProps}
              title={tagItem.tag.title}
              sx={{bgcolor: "primary.main", color: "primary.contrastText",}}
              action={
                <IconButton sx={{ ml: 3}} onClick={() => setItemFormDialogOpen(tagItem.tag.id)}>
                  <AddItemIcon sx={{color: 'primary.contrastText'}}/>
                </IconButton>
              }
            />
            <TagBoardColList tagItemList={tagItem} linkPath={linkPath} index={index}/>
          </Card>
        </Grid>
      )}
    </Draggable>
  )
}

export default TagBoardCol