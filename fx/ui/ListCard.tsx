import { Card, CardContent, CardHeader, Typography } from "@mui/material"
import Link from "next/link"

export interface ListCardProps {
  title: string
  children: JSX.Element | JSX.Element []
  href?: string
}

const ListCardHeader = ({title}: {title: string}) => {

  const SX = {fontSize: '1.25rem', fontWeight: '500', color: "secondary.contrastText"}
  return (
    <Typography variant={'h2'} sx={SX}>
      {title}
    </Typography>
  )
}

const ListCardHeaderLink = ({href, children}: { href: string, children: JSX.Element}) => (
  <Link href={`/categories/${href}`} >
    {children}
  </Link>
)

export const ListCard = ({title, children, href}: ListCardProps) => {

  const HeaderSX = { bgcolor: "secondary.main", borderBottom: '1px solid', borderColor: 'divider' }

  return (
    <Card >
      <CardHeader sx={HeaderSX}
        title={ href ?
          <ListCardHeaderLink href={href} ><ListCardHeader title={title} /></ListCardHeaderLink>
          : <ListCardHeader title={title} />
        }
      />
      <CardContent style={{height: "175px", overflow: "auto", paddingBottom: "0px"}}>
        {children}
      </CardContent>
    </Card>
  )
}

export default ListCard

//QA: Brian Francis 10-20-2023