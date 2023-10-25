import { useContext } from 'react'
import Link from 'next/link'
import {Box} from '@mui/material'
import { styled } from "@mui/material/styles"


import { FxThemeContext } from '@/fx/theme'

const Footer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '25px',
  justifyContent: 'center',
  width: '100%',
  borderTop: '1px solid red',
  borderColor: theme.palette.divider,
}))

export const AppFooter = () => {

  const {fxTheme: fx} = useContext(FxThemeContext)
  const primaryColor = fx.theme.palette.text.primary

  return (
    <Footer >
      <Link href={'/privacy-policy'} style={{color: primaryColor, paddingRight: '15px'}} >
            Privacy Policy
      </Link>
      <Link href={'/terms-of-use'}
        style={{ color: fx.theme.palette.text.primary}} >Terms of Use</Link>
    </Footer>
  )
}

export default AppFooter

//QA: Brian Francis 10-20-2023
