import {
  ReactNode, useEffect, useState
} from "react"

import {useSession} from "next-auth/react"
import PermissionCodes from "../enums/PermissionCodes";
export interface PermissionProps {
  roles: string[];
  children: ReactNode;
  org ?: any;
}

const Permission = (props: PermissionProps) => {

  const {roles, children} = props,

    {"data": session, status} = useSession(),


    loading = status === "loading",

    [hasPermission, setHasPermission] = useState<boolean>(false)

  useEffect( () => {
    setHasPermission(false)
    const user: any = session?.user

    if(props.org){
      if(roles.filter( (r:string) => r === PermissionCodes.ORG_LEADER).length === 1){
        if(user?.id === props.org.leader.id){
          setHasPermission(true)
        }
      }
    }

    if (user && user.roles) {


      roles.forEach((rr:string) => {
        const result = user.roles.filter((ur: string) => ur === rr)
        if (result.length >= 1) {
          setHasPermission(true)
        }
      })


    }

  }, [session, roles, props.org])

  return ( <>{ (hasPermission && !loading ) && children}</> )
}

export default Permission