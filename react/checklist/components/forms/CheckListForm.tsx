import { useContext, useEffect, useState } from "react"
import { SxProps, useTheme } from "@mui/material/styles"
import { Checkbox, LinearProgress, Stack, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import axios from "axios"
import {SectionContext} from "@/react/section"
import { FxCheckbox, CheckBoxForm } from "@/react/checklist"
import CheckBoxLabelForm from "./CheckBoxLabelForm"
import { ProjectContext } from "@/react/project/ProjectContext"
import { ItemContext } from "@/react/item"

const CheckListForm = () => {

  const {section} = useContext(SectionContext)
  const {project} = useContext(ProjectContext)
  const {item, setItem} = useContext(ItemContext)
  const {enqueueSnackbar} = useSnackbar()
  const theme = useTheme()
  const [checkboxes, setCheckboxes] = useState<FxCheckbox[] | undefined>(section?.checkboxes)
  const [progress, setProgress] = useState<number>(0)
  const [tempColor, setTempColor] = useState<string>('success.light')

  useEffect(() => {

    setCheckboxes(section?.checkboxes)
    const checked = checkboxes?.filter((c) => c.value).length

    if(checked === undefined || ! checkboxes?.length) return

    const p = 100 * checked / checkboxes.length
    setProgress(p)

    if(theme.palette.mode === 'light'){
      let tc = 'primary.light'
      if(p > 50) tc = 'primary.dark'
      if(p > 75) tc = 'primary.main'
      if(p === 100) tc = 'success.light'
      setTempColor(tc)
    }else{
      let tc = 'primary.dark'
      if(p > 50) tc = 'primary.main'
      if(p > 75) tc = 'primary.light'
      if(p === 100) tc = 'success.light'
      setTempColor(tc)
    }
  }, [section, checkboxes, theme.palette.mode])

  const checkboxClick = (event:React.ChangeEvent<HTMLInputElement>, index: number) => {

    if (!checkboxes) return
    const itemDir = `/api/members/projects/${project?.id}/items/${item?.id}`
    axios.patch(
      `${itemDir}/sections/${section?.id}/checkboxes/${checkboxes[index].id}`,
      {value: !checkboxes[index].value} )
      .then((res) => {

        if (res.status === axios.HttpStatusCode.Ok ){
          setItem(res.data.item)
        }
      })
      .catch((e) => {
        enqueueSnackbar(e.response.data.message, {variant: "error"})
      })
  }

  const sxProps: SxProps = {
    '&.MuiStack-root': {mt: 1},
    borderRadius: 1,
    p:2,
    border: '1px solid',
    borderColor: 'divider',
    width: '100%'
  }

  const progressSx: SxProps = {
    height: 10,
    borderRadius: 5,
    bgcolor: 'divider',
    width: '100%',
    mt: 0.5,
    '& .MuiLinearProgress-bar': {bgcolor: tempColor}
  }

  return (
    <Stack sx={sxProps}>
      <Stack direction={'row'}>
        <Typography variant={'caption'} sx={{pr: 1}}>{progress}%</Typography>
        <LinearProgress variant="determinate" value={progress} color="primary" sx={progressSx} />
      </Stack>
      { checkboxes?.map((c, i) => (
        <Stack direction={'row'} key={i}>
          <Checkbox size="small" checked={c.value} onChange={(e) => checkboxClick(e, i)}/>
          <CheckBoxLabelForm checkbox={c} />
        </Stack>
      )) }
      <CheckBoxForm />
    </Stack>
  )
}

export default CheckListForm