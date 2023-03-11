import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import tw, { styled } from "twin.macro"
import { FormRow } from "../components"
import { toast } from "react-toastify"
import {
  registerUser,
  loginUser,
  setFormType,
  forgotPassword,
} from "../features/user/userSlice"

const initialState = {
  email: "",
  password: "",
  passwordConfirm: "",
}

const AuthForm = () => {
  const [values, setValues] = useState(initialState)
  const { email, password, passwordConfirm } = values
  const { isLoading, formType } = useSelector((store) => store.user)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { email, password, passwordConfirm } = values

    if (
      !email ||
      (formType !== "forgot password" && !password) ||
      (formType === "register" && !passwordConfirm)
    ) {
      toast.error("please fill out all fields", { toastId: "fill all fields" })
      return
    }

    if (formType === "register") {
      return dispatch(registerUser({ email, password, passwordConfirm }))
    }

    if (formType === "login") {
      return dispatch(loginUser({ email, password }))
    }

    if (formType === "forgot password") {
      return dispatch(forgotPassword(email))
    }
  }

  // ONLY WORK WHEN USE CORS() NOT PROXY
  const handleGoogleLogin = () => {
    window.open("https://yard-api.onrender.com/api/v1/auth/google", "_self")
  }

  return (
    <Wrapper>
      <div className="body">
        <h2>{formType}</h2>
        <form onSubmit={handleSubmit}>
          <FormRow
            type="email"
            name="email"
            value={email}
            handleChange={handleChange}
          />
          {formType !== "forgot password" && (
            <FormRow
              type="password"
              name="password"
              value={password}
              handleChange={handleChange}
            />
          )}
          {formType === "register" && (
            <FormRow
              type="password"
              name="passwordConfirm"
              labelText="confirm password"
              value={passwordConfirm}
              handleChange={handleChange}
            />
          )}
          <span
            className={formType !== "login" ? "invisible" : ""}
            onClick={() => dispatch(setFormType("forgot password"))}
          >
            forgot password?
          </span>

          <button className="btn btn-primary button" disabled={isLoading}>
            {!isLoading && formType === "register" && "create account"}
            {!isLoading && formType === "login" && "login"}
            {!isLoading &&
              formType === "forgot password" &&
              "send a password reset link"}
            {isLoading && "Loading..."}
          </button>
        </form>
        <div className="oauth">
          <button
            className="btn btn-outline button"
            onClick={handleGoogleLogin}
          >
            continue with google
          </button>
          <p>
            {formType === "register"
              ? "already have an account? "
              : "don't have an account yet? "}

            {formType === "register" ? (
              <button
                className="btn-text"
                onClick={() => dispatch(setFormType("login"))}
              >
                Sign in
              </button>
            ) : (
              <button
                className="btn-text"
                onClick={() => dispatch(setFormType("register"))}
              >
                register
              </button>
            )}
          </p>
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  ${tw`p-2 pb-3`}

  h2 {
    ${tw`uppercase font-semibold text-3xl text-center mb-2`}
  }

  form {
    ${tw`pb-2 border-b border-secondary `}

    &>*:not(:where(span, button)):not(:last-of-type) {
      ${tw`mb-2`}
    }

    & > button {
      ${tw`mt-0.5`}
    }

    span {
      ${tw`
        inline-block w-full pr-1 cursor-pointer 
        text-sm text-gray-500 text-right transition-colors hover:text-gray-700
      `}

      &.invisible {
        ${tw`opacity-0 select-none`}
      }
    }
  }

  .oauth {
    ${tw`pt-2 text-center`}

    .button {
      ${tw`mb-3`}
    }

    .btn-text {
      ${tw`text-primary font-semibold uppercase`}
    }
  }

  .button {
    ${tw`w-full py-1`}
  }
`
export default AuthForm
