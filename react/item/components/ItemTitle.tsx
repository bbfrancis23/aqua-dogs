import { useContext } from "react"
import { Skeleton, Typography } from "@mui/material"
import { SxProps } from "@mui/material/styles"
import { NoPermission, Permission, PermissionCodes } from "@/fx/ui"
import { MemberContext } from "@/react/members"
import ItemContext from "../ItemContext"

export interface ItemTitleProps {
  itemIsLoading: boolean
  setShowForm: (showForm: boolean) => void
}

const ItemTitle = ({itemIsLoading, setShowForm}: ItemTitleProps) => {

  const {item} = useContext(ItemContext)
  const {member} = useContext(MemberContext)

  const sxProps: SxProps = {
    fontSize: {xs: '2rem', sm: '3rem'},
    padding: 5,
    paddingLeft: 2,
    width: '100%',
  }

  return (
    <>
      <Permission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
        <Typography variant={'h1'} sx={sxProps} onClick={() => setShowForm(true)} >
          {itemIsLoading ? <Skeleton /> : item?.title}
        </ Typography>
      </ Permission>
      <NoPermission code={PermissionCodes.ITEM_OWNER} item={item} member={member}>
        <Typography variant={'h1'} sx={sxProps} >
          {itemIsLoading ? <Skeleton /> : item?.title}
        </Typography>
      </NoPermission>
    </>
  )
}

export default ItemTitle

// QA Brian Francis 10-28-23