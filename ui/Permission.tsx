import {
  ReactNode, useEffect, useState
} from "react"

import {useSession} from "next-auth/react"
export interface PermissionProps {
  roles: string[];
  children: ReactNode
}

const Permission = (props: any) => {

  const {roles, children} = props,

    {"data": session, status} = useSession(),


    loading = status === "loading",

    [hasPermission, setHasPermission] = useState<boolean>(false)

  useEffect( () => {
    setHasPermission(false)
    const user: any = session?.user


    if (user && user.roles) {
      roles.forEach((rr:string) => {
        const result = user.roles.filter((ur: string) => ur === rr)
        if (result.length >= 1) {
          setHasPermission(true)
        }
      })
    }

  }, [session, roles])

  return ( <>{ (hasPermission && !loading ) && children}</> )
}

export default Permission