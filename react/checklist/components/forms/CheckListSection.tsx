import { useContext, useEffect, useState } from "react"
import { SxProps, useTheme } from "@mui/material/styles"
import { LinearProgress, Stack, Typography } from "@mui/material"
import {SectionContext} from "@/react/section"
import { FxCheckbox, CheckBoxForm, CheckList } from "@/react/checklist"

const CheckListSection = () => {

  const {section} = useContext(SectionContext)
  const theme = useTheme()
  const [checkboxes, setCheckboxes] = useState<FxCheckbox[] | undefined>(section?.checkboxes)
  const [progress, setProgress] = useState<number>(0)
  const [tempColor, setTempColor] = useState<string>('success.light')

  useEffect(() => {

    setCheckboxes(section?.checkboxes)
    const checked = checkboxes?.filter((c) => c.value).length

    if(checked === undefined || ! checkboxes?.length) return

    const p = Math.floor(100 * checked / checkboxes.length)
    setProgress(p)

    let tc = 'primary.light'
    if(p > 50) tc = 'primary.dark'
    if(p > 75) tc = 'primary.main'
    if(p === 100) tc = 'success.light'
    setTempColor(tc)

  }, [section, checkboxes, theme.palette.mode])


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
      { checkboxes && checkboxes.length > 0 && ( <CheckList checkboxes={checkboxes}/>) }
      <CheckBoxForm />
    </Stack>
  )
}

export default CheckListSection

// QA Brian Francis 12-18-23