import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { CreateCommentForm } from "@/react/item/";
import { Section } from "@/react/section/";
import { Member, ProjectMemberAvatar } from "@/react/Member/";
import { InfoPageLayout, PermissionCodes } from "@/fx/ui";
import { PublicCardPage, PageTitle, CodeEditor } from "./CardPage";


export const Page = (props: PublicCardPage) => {

  const { catTitle, colTitle, item, board, openAuthDialog } = props;

  const { data: session } = useSession();
  const [member, setMember] = useState<Member | undefined>(undefined);

  useEffect(() => {

    if (session && session.user) {
      const castSession = session.user as any;
      setMember({ id: castSession.id, name: castSession.name, email: castSession.email });
    }
  }, [session]);

  return (

    <InfoPageLayout title={<PageTitle>{catTitle} : {colTitle} <br /> {item.title} </PageTitle>}>
      <Stack spacing={3} alignItems={'flex-start'} sx={{ p: 10, pt: 5, width: '100%' }}>
        {item.sections?.map((s: Section) => {
          if (s.sectiontype === "63b88d18379a4f30bab59bad") {
            return (
              <CodeEditor key={s.id} value={s.content} language="jsx" readOnly padding={15} style={{
                width: '100%',
                fontSize: 12,
                backgroundColor: "#f5f5f5",
                fontFamily: "ui-monospace,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
              }} />
            );
          }
          return (<Typography key={s.id}>{s.content}</Typography>);
        })}
        <Box sx={{ width: '100%' }}>
          <Divider sx={{ pb: 3 }}>Comments</Divider>
          {member && (
            <Stack spacing={3} direction={'row'} sx={{ width: '100%' }}>
              <Box>
                <ProjectMemberAvatar type={PermissionCodes.PROJECT_MEMBER} member={member} />
              </Box>
              <CreateCommentForm member={member} />
            </Stack>
          )}
          {!member && (
            <>
              <Typography variant={'body1'}>Please Login or Register to comment</Typography>
              <Button variant={'contained'}
                onClick={() => openAuthDialog()}>Authenticate</Button>
            </>
          )}
        </Box>
      </Stack>
    </InfoPageLayout>
  );
};
