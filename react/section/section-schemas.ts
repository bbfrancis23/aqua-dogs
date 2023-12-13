import * as Yup from 'yup'

export const sectionSchema = Yup.object().shape({section: Yup.string().required('')})

export const commentSchema = Yup.object().shape({comment: Yup.string().required('')})

export const checkListSchema = Yup.object().shape({comment: Yup.string().required('')})
