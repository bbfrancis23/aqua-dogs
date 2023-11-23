
import { AccordionSummary, AccordionDetails, Divider, Box} from '@mui/material'
import { AssessmentTypes, AssessmentGroupButton } from '@/react/assessments'
import {CardAccordion} from '@/fx/ui'


const AssessmentAccordion = () => {

  const {WORTH, COMPLEXITY, PRIORITY} = AssessmentTypes
  const assessmentTypes = [WORTH, COMPLEXITY, PRIORITY]

  return (
    <CardAccordion >
      <AccordionSummary aria-controls="assessment-content" id="assessment-header" sx={{ p: 0, }} >
        <Box sx={{width: '100%'}}><Divider >Assessments</Divider></Box>
      </AccordionSummary>
      <AccordionDetails>
        { assessmentTypes.map((type) => ( <AssessmentGroupButton key={type} type={type} /> )) }
      </AccordionDetails>
    </CardAccordion>
  )
}

export default AssessmentAccordion

// QA: Brian Francis 11-22-23