import Image from "next/image"

export const LogoImage = () => {

  const src = '/images/strategy-fx-logo.png'

  return (
    <Image src={src} alt="logo" width="125" height="25" style={{position: 'relative', top: '5px'}}/>
  )
}

export default LogoImage

// QA: Brian Francis 10-20-2023