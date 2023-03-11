import tw, { styled } from "twin.macro"
import { ProfileEditForm } from "../components"
import { useLocation } from "react-router-dom"

const ResetPasswordPage = () => {
  const params = new URLSearchParams(useLocation().search)

  return (
    <Wrapper>
      <div className="container">
        <ProfileEditForm
          type="reset-password"
          title="reset password"
          list={["newPassword", "newPasswordConfirm"]}
          expand={true}
          params={params}
        />
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .container {
    ${tw`
      pt-[calc(var(--navbar-mobile-size) + 5rem)] mb-3
      lg:pt-[calc(var(--navbar-size) + 3rem)] 
    `}
  }
`
export default ResetPasswordPage
