import { ReactNode, useEffect, useState} from "react"
import {useSession} from "next-auth/react"

import PermissionCodes from "../enums/PermissionCodes";
import { Member } from "../interfaces/MemberInterface";
import { Org } from "../interfaces/OrgInterface";

export interface PermissionProps {
  roles: string[];
  children: ReactNode;
  org ?: any;
}


export const userHasPermission = (roles: string[], user:any, org?: Org) => {

  let hasPermission: boolean = false

  if(org){
    if(roles.filter( (r:string) => r === PermissionCodes.ORG_LEADER).length === 1){

      if(user?.id === org?.leader.id){
        hasPermission = true
      }
    }

    if(roles.filter( (r:string) => r === PermissionCodes.ORG_ADMIN).length === 1){

      org.admins.forEach( (a:Member) => {
        if(user?.id === a.id){
          hasPermission = true
        }
      })
    }
  }

  if (user && user.roles) {

    roles.forEach((rr:string) => {
      const result = user.roles.filter((ur: string) => ur === rr)
      if (result.length >= 1) {
        hasPermission = true
      }
    })
  }
  return hasPermission
}

const Permission = (props: PermissionProps) => {

  const {roles, children} = props
  const {"data": session, status} = useSession()
  const loading = status === "loading"

  const [hasPermission, setHasPermission] = useState<boolean>(false)

  useEffect( () => {
    setHasPermission(false)
    const user: any = session?.user

    setHasPermission(userHasPermission(roles, user, props.org))

  }, [session, roles, props.org])


  return ( <>{ (hasPermission && !loading ) && children}</> )
}

export const NoPermission = (props: PermissionProps) => {

  const {roles, children} = props,

    {"data": session, status} = useSession(),


    loading = status === "loading",

    [hasPermission, setHasPermission] = useState<boolean>(false)

  useEffect( () => {
    setHasPermission(false)
    const user: any = session?.user

    setHasPermission(userHasPermission(roles, user, props.org))

  }, [session, roles, props.org])

  return ( <>{ (!hasPermission && !loading ) && children}</> )
}

export default Permission