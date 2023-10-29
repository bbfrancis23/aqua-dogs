import {useEffect, useState} from "react"

import ThumbUpIcon from "@mui/icons-material/ThumbUpOutlined"
import ThumbUpFilledIcon from "@mui/icons-material/ThumbUp"
import ThumbDownIcon from "@mui/icons-material/ThumbDownOutlined"
import ThumbDownFilledIcon from "@mui/icons-material/ThumbDown"

import {Item} from "../item-types"
import {IconButton} from "@mui/material"
import axios from "axios"


import {useSession} from "next-auth/react"

import {useSnackbar} from "notistack"

export interface ItemRatingProps {
  item: Item;
  openAuthDialog: () => void
}


export default function ItemRating(props: ItemRatingProps){
  const {openAuthDialog} = props

  const [item, setItem] = useState<Item>(props.item)

  const {data: session, status} = useSession()

  const loading = status === "loading"

  const {enqueueSnackbar} = useSnackbar()

  const [memberVote, setMemberVote] = useState<number>(0)

  const calculateRating = () => {

    const upvotes = item?.upvotes?.length ? item?.upvotes?.length : 0
    const downvotes = item?.downvotes?.length ? item?.downvotes?.length : 0
    return upvotes - downvotes
  }

  const [rating, setRating] = useState<number>(calculateRating())


  useEffect(() => {

    let vote = 0

    if(session){
      const user: any = session?.user
      let upvote: number = 0
      let downvote: number = 0

      if(item.upvotes) upvote = item?.upvotes.filter((v:string) => v === user?.id).length

      if(item.downvotes) downvote = item?.downvotes.filter((v:string) => v === user?.id).length

      if(upvote === 1) vote = 1
      else if(downvote === 1) vote = -1

    }

    setMemberVote(vote)

    const upvotes = item?.upvotes?.length ? item?.upvotes?.length : 0
    const downvotes = item?.downvotes?.length ? item?.downvotes?.length : 0
    setRating( upvotes - downvotes)

  }, [session, item])


  const handleUpVote = () => {

    if(session){
      if(memberVote === 1){
        axios.patch(`/api/items/vote/${item.id}`, {vote: "reset"}).then( (r) => {
          setItem(r.data.item)
        })
      }else{

        axios.patch(`/api/items/vote/${item.id}`, {vote: "up"}).then((r) => {
          setItem(r.data.item)
        })
      }

    }else{
      enqueueSnackbar("You must be a member to vote")
      openAuthDialog()
    }


  }

  const handleDownVote = () => {

    if(session){

      if(memberVote === -1){
        axios.patch(`/api/items/vote/${item.id}`, {vote: "reset"})
        setMemberVote(0)
        setRating( (r) => r + 1)
      }else{

        axios.patch(`/api/items/vote/${item.id}`, {vote: "down"})

        if(memberVote === 0){
          setRating( (r) => r - 1)
        }else{
          setRating( (r) => r - 2)
        }
        setMemberVote(-1)
      }
    }else{
      enqueueSnackbar("You must be a member to vote")
      openAuthDialog()
    }

  }


  return (
    <>
      Rating: {rating}
      <IconButton aria-label="thumb up" onClick={handleUpVote}>
        { memberVote === 1 ? <ThumbUpFilledIcon /> : <ThumbUpIcon /> }
      </IconButton>
      <IconButton aria-label="thumb down" onClick={handleDownVote}>
        { memberVote === -1 ? <ThumbDownFilledIcon /> : <ThumbDownIcon /> }
      </IconButton>
    </>

  )

}

// Wait to QA this when it is added back in.