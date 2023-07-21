import { Item } from "@/interfaces/ItemInterface"

import {findProjectItems} from "@/mongo/controls/member/project/items/findProjectItems"

import { getItem } from "@/mongo/controllers/itemControllers";
import InfoCardContainer from "@/ui/information-card/InfoCardContainer";
import InfoCard from "@/ui/information-card/InfoCard";
import { Breadcrumbs, CardContent, CardHeader, Stack, Typography } from "@mui/material";
import { Section } from "@/interfaces/SectionInterface";
import dynamic from "next/dynamic";
import Link from "next/link";

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  {ssr: false}
)

export const PublicItemPage = ( props: any) => {


  const {item} = props

  return (


    <InfoCardContainer >
      <InfoCard>
        <CardHeader title={
          <Typography variant={'h6'} >
            {item.title}
          </Typography>
        }
        sx={{backgroundColor: 'secondary.main', color: 'secondary.contrastText'}} />
        <CardContent sx={{pl: 3}}>
          <Stack spacing={3} alignItems={'flex-start'}>
            { item.sections?.map( ( s: Section) => {
              if(s.sectiontype === "63b88d18379a4f30bab59bad"){
                return (
                  <CodeEditor
                    key={s.id}
                    value={s.content}
                    language="jsx"
                    readOnly
                    padding={15}
                    style={{
                      width: '100%',
                      fontSize: 12,
                      backgroundColor: "#f5f5f5",
                      fontFamily:
                            "ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                    }}
                  />
                )
              }
              return ( <Typography key={s.id}>
                {s.content}
              </Typography>)
            })}

          </Stack>
        </CardContent>
      </InfoCard>
    </InfoCardContainer>
  )
}

export default PublicItemPage

export const getStaticPaths = async () => {
  let items: Item[] = await findProjectItems('64b6bc0a1b836981ba0c4cc5')

  console.log('items', items)

  const paths = items.map( (i: any) =>
    ({params: {
      dirId: `${i.title.toLocaleLowerCase().trim().replace(/ /g, '-')}`,
      itemId: i._id
    }}))

  // console.log(paths)

  return {paths, fallback: false}

}

export const getStaticProps = async ({params}: any) => {

  // let item = {}
  const {dirId, itemId} = params
  const item = await getItem(itemId)

  return {props: {item}}

}