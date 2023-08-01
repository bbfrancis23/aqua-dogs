import { ReactNode, useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { Member } from '@/interfaces/MemberInterface';
import { Project } from '@/interfaces/ProjectInterface';
import { Item } from '@/interfaces/ItemInterface';

export enum PermissionCodes {
  PROJECT_LEADER = 'ProjectLeader',
  PROJECT_ADMIN = 'ProjectAdmin',
  PROJECT_MEMBER = 'ProjectMember',
  ITEM_OWNER = 'ItemOwner',
  MEMBER = 'Member',
}

export interface permissionFunction {
  code: PermissionCodes;
  project?: Project;
  member?: Member;
  item?: Item;
}

export const permission = ( props: permissionFunction): boolean => {

  const {code, project, member, item} = props;


  if(! member) return false


  if (code === PermissionCodes.PROJECT_MEMBER) {

    if (project?.leader.id === member.id) return true
    if(project?.admins?.find( (a) => a.id === member.id)) return true
    if(project?.members?.find( (a) => a.id === member.id)) return true

  }

  if(code === PermissionCodes.PROJECT_ADMIN){

    if(project?.leader.id === member.id) return true
    if(project?.admins?.find( (a) => a.id === member.id)) return true
  }

  if(code === PermissionCodes.PROJECT_LEADER){

    if(project?.leader.id === member.id) return true

  }

  if(code === PermissionCodes.ITEM_OWNER){
    if(!item) return false
    if(item.owners?.find( (o) => o === member.id)) return true
  }

  return false;
};

export interface PermissionComponent {
  code: PermissionCodes;
  children: ReactNode;
  project?: Project;
  member?: Member;
  item?: Item;
}

const Permission = (props: PermissionComponent) => {
  const { code, project, member, children, item } = props;
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    setHasPermission(false);

    setHasPermission(permission({code, member, project, item}));
  }, [session, code, project, member, item]);

  return <>{hasPermission && !loading && children}</>;
};

export const NoPermission = (props: PermissionComponent) => {

  const { code, project, member, children, item } = props;
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    setHasPermission(false);

    setHasPermission(permission({code, member, project, item}));
  }, [session, code, project, member, item]);

  return ( <>{ (!hasPermission && !loading ) && children}</> )
}

export default Permission;

// QA done