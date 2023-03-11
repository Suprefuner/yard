import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { toast } from "react-toastify"
import { Loading } from "../components"
import { updateSearchboxInView } from "../features/general/generalSlice"
import customFetch from "../utils/axios"
import { useDispatch } from "react-redux"
import illustration from "../assets/verify-email-illustration.svg"

const VerifyEmailPage = () => {
  const [counter, setCounter] = useState(3)
  const [isLoading, setLoading] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = new URLSearchParams(useLocation().search)

  const verifyToken = async () => {
    setLoading(true)
    try {
      await customFetch.post("/auth/verify-email", {
        verificationToken: params.get("token"),
        email: params.get("email"),
      })
    } catch (error) {
      toast.error(`invalid verification, please try again`)
    }
    setLoading(false)
  }

  useEffect(() => {
    dispatch(updateSearchboxInView(true))
    verifyToken()
  }, [])

  useEffect(() => {
    if (isLoading) return
    const countDown = setInterval(() => {
      setCounter((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(countDown)
  }, [isLoading])

  useEffect(() => {
    if (counter > 0) return
    navigate("/")
  }, [counter])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Wrapper>
      <div className="container">
        <h1>🎉email verified!🎉</h1>
        <p>
          Will redirect to home page in <span>{counter}</span>s
        </p>
        <img
          src={illustration}
          alt="verify email success"
          className="illustration"
        />
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  ${tw`min-h-[calc(100vh - var(--navbar-size))]`}

  .container {
    ${tw`
      pt-[calc(var(--navbar-mobile-size) + 2rem)] pb-5 space-y-2 
      lg:(pt-[calc(var(--navbar-size) + 8rem)] space-y-3)
      text-center
    `}

    h1 {
      ${tw`text-4xl capitalize`}
    }

    p {
      ${tw`text-xl text-gray-500`}
    }

    span {
      ${tw`text-[2.5rem]`}
    }

    .illustration {
      ${tw`h-[30vh] mx-auto translate-y-5`}
    }
  }
`
export default VerifyEmailPage
