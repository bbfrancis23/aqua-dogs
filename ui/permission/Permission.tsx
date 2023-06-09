import { ReactNode, useEffect, useState } from 'react';
import { Member } from '../../interfaces/MemberInterface';
import { Project } from '../../interfaces/ProjectInterface';
import { useSession } from 'next-auth/react';

export enum PermissionCodes {
  PROJECT_LEADER = 'ProjectLeader',
  PROJECT_ADMIN = 'ProjectAdmin',
  PROJECT_MEMBER = 'ProjectMember',
  MEMBER = 'Member',
}

export const permission = (
  code: PermissionCodes,
  member?: Member,
  project?: Project
): boolean => {

  //console.log('code', code)
  //console.log('member', member)
  //console.log('project', project)

  let hasPermission = false;
  if (code === PermissionCodes.PROJECT_MEMBER) {
    if (member) {
      if (project?.leader.id === member.id) {
        hasPermission = true;
      }
    }
  } else if(code === PermissionCodes.PROJECT_ADMIN){
    if(member){


      if(project?.leader.id === member.id){
        hasPermission = true
      }
    }
  } else if(code === PermissionCodes.PROJECT_LEADER){
    if(member){


      if(project?.leader.id === member.id){
        hasPermission = true
      }
    }
  }

  return hasPermission;
};

export interface PermissionProps {
  code: PermissionCodes;
  children: ReactNode;
  project?: Project;
  member?: Member;
}

const Permission = (props: PermissionProps) => {
  const { code, project, member, children } = props;
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    setHasPermission(false);

    setHasPermission(permission(code, member, project));
  }, [session, code, project, member]);

  return <>{hasPermission && !loading && children}</>;
};

export default Permission;
