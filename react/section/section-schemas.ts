import * as Yup from 'yup'

const reqText = 'SECTION is required'
export const sectionSchema = Yup.object().shape({section: Yup.string().required(reqText)})

const reqCommentText = 'COMMENT is required'
export const commentSchema = Yup.object().shape({comment: Yup.string().required(reqCommentText)})
