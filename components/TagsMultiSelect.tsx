import { useState, useEffect } from "react";
import { Button,Box,  FormControl, InputLabel, Select, TextField, Dialog, DialogTitle, OutlinedInput, Stack,
  DialogContent,DialogActions, SelectChangeEvent, MenuItem, useTheme } from "@mui/material"

import useSWR from "swr";

function getStyles(tag:any, itemTags:any, theme: any) {
  return {
    fontWeight:
      itemTags.indexOf(tag) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}  

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function TagsMultiSelect() {  
  const theme = useTheme();
  const [ tags, setTags] =  useState([])
  const [itemTags, setItemTags] = useState([]);


  const { data, error } = useSWR("http://localhost:5000/api/tags", fetcher);

  

  useEffect(() => {
    if (data) {      setTags(data.tags);    }
  }, [data]);


  const handleTagsChange = (event: any) => {
    const { target: {value} } = event
    setItemTags(typeof value === 'string' ? value.split(',') : value,);
  }  

  if (!data && !tags) {
    return <Box>Loading...</Box>;
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
              key={tag.id} 
              value={tag.id}
              style={getStyles(tag.title,itemTags, theme)}
            >
              {tag.title}
            </MenuItem>
          ))
          } 
        </Select>
      </FormControl>
  )
}