import Image from "next/image"

export const LogoImage = () => (
  <Image src="/images/strategy-fx-logo.png" alt="logo" width="125" height="25"
    style={{position: 'relative', top: '5px'}}/>
)

export default LogoImage