import {Activity, NewActivity} from '@/interfaces/ActivityInterface'
import {useSnackbar} from 'notistack'
import {useEffect, useState} from 'react'

// export interface useMemberInterface {

// }

const useMemberActivity = (): [activity: Activity[], newActivity: (a: NewActivity) => void] => {
  const [activities, setActivity] = useState<Activity[]>([])
  const [id, setId] = useState<number>(0)

  const {enqueueSnackbar} = useSnackbar()

  const addActivity = (newActivity: NewActivity) => {
    setId(id + 1)

    const activity = {...newActivity, id, createdAt: new Date()}

    setActivity([activity, ...activities])
  }

  useEffect(() => {
    if (activities.length > 0) {
      const newActivity = activities[0]
      enqueueSnackbar(newActivity.title, {variant: 'success'})
    }
  }, [activities, enqueueSnackbar])

  return [activities, (a: NewActivity) => addActivity(a)]
}
export default useMemberActivity
