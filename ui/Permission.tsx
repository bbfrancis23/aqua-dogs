import { useSession} from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

export interface PermissionProps {
  roles: string[];
  children: ReactNode
}

const Permission = (props: any) => {

  const {roles, children} = props

  const { data: session, status } = useSession()

  
  const loading = status === "loading"  

  const [ hasPermission, setHasPermission ] = useState<boolean>(false)

  useEffect( () => {
    setHasPermission(false)
    const user: any = session?.user;

    
    if (user && user.roles) {
      roles.forEach((rr:string) => {
        const result = user.roles.filter((ur: string) => ur === rr);
        if (result.length >= 1) {
          setHasPermission(true)
        }
      });
    }

  }, [ session, roles ])

  return ( <>{ (hasPermission && !loading ) && children}</> )
}

export default Permission