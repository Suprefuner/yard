import { useEffect } from "react"
import { ProfileEditForm } from "../components"
import { changeEditMode } from "../features/user/userSlice"
import { useDispatch } from "react-redux"

const ProfileEditPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(changeEditMode(true))
    return () => dispatch(changeEditMode(false))
  }, [])

  return (
    <div className="my-3 space-y-2.5">
      <ProfileEditForm
        title="Public profile"
        list={["username", "firstName", "lastName", "description"]}
      />
      <ProfileEditForm
        type="password"
        title="password verification"
        list={["password", "newPassword", "newPasswordConfirm"]}
      />
      <ProfileEditForm
        title="private information"
        list={["email", "gender", "birthday"]}
      />
    </div>
  )
}

export default ProfileEditPage
