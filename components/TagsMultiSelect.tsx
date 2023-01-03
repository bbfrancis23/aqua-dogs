import { Button, FormControl, InputLabel, Select, TextField, Dialog, DialogTitle, OutlinedInput, Stack,
  DialogContent,DialogActions, SelectChangeEvent, MenuItem, useTheme } from "@mui/material"
import { useState } from "react";

const tags= ['Best Practices', 'Standards', 'JavaScript']

function getStyles(tag:any, itemTags:any, theme: any) {
  return {
    fontWeight:
      itemTags.indexOf(tag) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

  

export default function TagsMultiSelect() {
  
  const theme = useTheme();

  const [itemTags, setItemTags] = useState([]);

  const handleTagsChange = (event: any) => {
    const { target: {value} } = event
    setItemTags(typeof value === 'string' ? value.split(',') : value,);
  }
  return (  
    <FormControl >
      <InputLabel id="tags-label">Tags</InputLabel>
      <Select
        labelId="tags-label"
        id="tags"
        multiple
        value={itemTags}
        onChange={handleTagsChange}
        input={<OutlinedInput label="Name" />}
      >
        {
        tags.map( (tag: any) => (
          <MenuItem 
            key={tag} 
            value={tag}
            style={getStyles(tag,itemTags, theme)}
          >
            {tag}
          </MenuItem>
        ))
        } 
      </Select>
    </FormControl>
  )
}