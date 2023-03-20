import * as Yup from 'yup';

const passwordMinLength = 6;

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(
      passwordMinLength,
      `Password must be at least ${passwordMinLength} characters`
    )
    .required('Password is required'),
  newPassword: Yup.string()
    .min(
      passwordMinLength,
      `Password must be at least ${passwordMinLength} characters`
    )
    .required('Password is required'),
});

export default ChangePasswordSchema;
