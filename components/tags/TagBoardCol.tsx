import { Draggable } from "react-beautiful-dnd";

import { Card, CardHeader, Grid, IconButton, useTheme } from "@mui/material"
import AddItemIcon from '@mui/icons-material/PostAdd';

import { Org } from "../../interfaces/OrgInterface";
import TagBoardColList from "./TagBoardColList";
import Permission from "../../ui/Permission";
import PermissionCodes from "../../enums/PermissionCodes";

export interface BoardColProps{
  medCols: number;
  lgCols: number;
  id: string;
  tagItem: any;
  index: number;
  org?: Org;
  setItemFormDialogOpen: (tagId ?:string) => void;
  updateBoardFromDataBase: () => void;
}

const TagBoardCol = (props: BoardColProps) => {
  const {medCols, lgCols, id, tagItem, index, org, setItemFormDialogOpen,
    updateBoardFromDataBase} = props


  const theme = useTheme()

  const linkPath = org ? `/member/orgs/${org.id}/items` : '/items'

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
                <Permission roles={[PermissionCodes.SITE_ADMIN]}>
                  <IconButton sx={{ ml: 3}} onClick={() => setItemFormDialogOpen(tagItem.tag.id)}>
                    <AddItemIcon sx={{color: 'primary.contrastText'}}/>
                  </IconButton>
                </Permission>
              }
            />
            <TagBoardColList tagItemList={tagItem} linkPath={linkPath}
              updateBoardFromDataBase={() => updateBoardFromDataBase()}/>
          </Card>
        </Grid>
      )}
    </Draggable>
  )
}

export default TagBoardCol