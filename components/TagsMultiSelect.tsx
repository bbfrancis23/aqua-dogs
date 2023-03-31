import { useState, useEffect } from "react";
import { Box,  FormControl, InputLabel, Select,  OutlinedInput,  MenuItem, useTheme } from "@mui/material"

import useSWR from "swr";
import axios from "axios";


function getStyles(tag:any, itemTags:any, theme: any) {
  return {
    fontWeight:
      itemTags?.indexOf(tag) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}  

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function TagsMultiSelect(props: any) {  

  const {item, setItem} = props
  const theme = useTheme();
  const [ tags, setTags ] =  useState([])
  const [ itemTags, setItemTags ] = useState([]);
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  const { data, error } = useSWR("/api/tags", fetcher);  

  useEffect(() => {

    if (data) {      
      setTags(data.tags)    
    }

    if(item.tags){
      setItemTags( item.tags?.map( (t:any) => t.id))
    }
  }, [ data, item ]);


  const handleTagsChange = (event: any) => {
    const { target: {value} } = event
    setItemTags(typeof value === 'string' ? value.split(',') : value,);
  }  

  if (!data && !tags) {
    return <Box>Loading...</Box>;
  }


  const handleTagsCloseMenu = () => {
    
    setIsSubmitting(true)

    if(item.id) {
      
      try {
        axios.patch(`/api/items/${item.id}`, {tags: itemTags})
        .then((res) => {
          setItem(res.data.item)

          setIsSubmitting(false)
        })
        .catch((error) => {
          console.log(error)
          setIsSubmitting(false)
        })
      } catch (e) {
        console.log(e)
        setIsSubmitting(false)
      }
      setIsSubmitting(false)
    }
  }

  return (  
   
      <FormControl sx={{width: '100%'}}>
        <InputLabel id='tags-label'>Tags</InputLabel>
        <Select
          labelId='tags-label'
          id='tags'
          multiple
          fullWidth
          disabled={isSubmitting || !item?.id}
          value={itemTags}
          onChange={handleTagsChange}
          input={<OutlinedInput label='Name' />}
          onClose={handleTagsCloseMenu}
        >
          {
          tags.map( (tag: any) => (
            <MenuItem 
              key={tag.id} 
              value={tag.id}
              style={getStyles(tag.title, itemTags, theme)}
            >
              {tag.title}
            </MenuItem>
          ))
          } 
        </Select>
      </FormControl>
  )
}