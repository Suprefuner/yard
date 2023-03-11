import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import tw, { styled } from "twin.macro"
import { BiChevronDown } from "react-icons/bi"
import { toast } from "react-toastify"
import { FormRow } from "../components"
import { inputType } from "../utils/links"
import {
  updateCurrentUser,
  updatePassword,
  resetPassword,
} from "../features/user/userSlice"

const ProfileEditForm = ({ type, title, list, expand = false, params }) => {
  const [showForm, setShowForm] = useState(expand)
  const [isChange, setIsChange] = useState(expand)
  const [values, setValues] = useState({})
  const { user } = useSelector((store) => store.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) return

    setValues(() => {
      const obj = {}
      list.forEach((item) => {
        item === "birthday"
          ? (obj[item] = user[item]?.split("T")[0])
          : (obj[item] = user[item])
      })
      return obj
    })
  }, [user])

  /*
  ==========================================================
  CHECK IF PROFILE INFORMATION DIFFERENT FROM SERVER
  IF YSE CAN SAVE CHANGE
  ==========================================================
  */
  useEffect(() => {
    if (!user) return
    setIsChange(() => {
      // SINCE USER SHOULD NEVER KNOW IF THERE IS DIFFERENCE
      if (type === "reset-password") return true
      for (let property in values) {
        const userProp = user[property]
        const valuesProp = values[property]
        if (
          userProp === valuesProp ||
          (userProp === undefined && valuesProp === "")
        ) {
          continue
        } else {
          return true
        }
      }
      return false
    })
  }, [values])

  // CLEAR LOCAL FORM VALUES
  const clearValue = () => {
    setValues(() => {
      const obj = {}
      list.forEach((item) => (obj[item] = ""))
      return obj
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    /*
    ==================================================
    FOR UPDATE PASSWORD
    ==================================================
    */
    if (type === "password" || type === "reset-password") {
      if (values.newPassword !== values.newPasswordConfirm) {
        toast.error(
          `confirm password is different from password, please try again`
        )
        return
      }

      if (type === "password") {
        dispatch(updatePassword(values))
      }

      if (type === "reset-password") {
        dispatch(
          resetPassword({
            email: params.get("email"),
            password: values.newPassword,
            passwordConfirm: values.newPasswordConfirm,
            token: params.get("token"),
          })
        )
      }

      clearValue()
      return
    }
    //==================================================
    dispatch(updateCurrentUser(values))
  }

  const toggleForm = () => {
    setShowForm((prev) => !prev)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Wrapper>
      <div className="header" onClick={toggleForm}>
        <h2>{title}</h2>
        <BiChevronDown className={`icon ${showForm && "up"}`} />
      </div>
      <div className={showForm ? "body show" : "body"}>
        <form onSubmit={handleSubmit}>
          {list.map((property, i) => (
            <FormRow
              key={i}
              type={inputType[property].type}
              name={property}
              value={values[property]}
              handleChange={handleChange}
              labelText={inputType[property].labelText}
            />
          ))}
          <button className="btn btn-primary" disabled={!isChange}>
            save change
          </button>
        </form>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  ${tw` border rounded-xl overflow-hidden`}

  .header {
    ${tw`flex items-center justify-between px-2 py-1 cursor-pointer`}

    h2 {
      ${tw`text-[18px] font-semibold lg:text-xl`}
    }

    .icon {
      ${tw`text-2xl transition-transform duration-500`}

      &.up {
        ${tw`-rotate-180`}
      }
    }
  }

  .body {
    ${tw`max-h-0 transition-all duration-500 px-2`}

    &.show {
      ${tw`max-h-[1000px] py-2  border-t`}
    }

    form {
      ${tw`pt-2 space-y-3`}
    }

    label {
      ${tw`capitalize block `}
    }

    input,
    textarea {
      ${tw`border w-full px-2 py-1 rounded-lg resize-none`}
    }

    .btn {
      ${tw`block px-3 py-1 ml-auto`}

      &:disabled {
        ${tw`bg-gray-500 text-gray-300 cursor-auto`}
      }
    }
  }
`
export default ProfileEditForm
