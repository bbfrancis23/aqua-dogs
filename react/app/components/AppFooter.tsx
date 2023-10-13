
import {Box, Theme, useTheme, styled} from '@mui/material'
import Link from 'next/link'


const Footer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '25px',
  justifyContent: 'center',
  width: '100%',
  borderTop: '1px solid red',
  borderColor: theme.palette.divider,
}))

export const AppFooter = () => {


  const theme: Theme = useTheme()

  return (
    <Footer >
      <Link
        href={'/privacy-policy'} style={{color: theme.palette.text.primary, paddingRight: '15px'}} >
            Privacy Policy
      </Link>
      <Link href={'/terms-of-use'}
        style={{ color: theme.palette.text.primary}} >Terms of Use</Link>
    </Footer>

  )
}

export default AppFooter
