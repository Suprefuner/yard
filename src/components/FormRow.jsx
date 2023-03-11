import { useState } from "react"
import tw, { styled } from "twin.macro"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"

const FormRow = ({ type, name, value, labelText, handleChange, disable }) => {
  // CONTROL PASSWORD EYE ICON
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  if (type === "checkbox")
    return (
      <CheckBoxWrapper>
        <input
          type={type}
          id={labelText === "meet up" ? "meetUp" : "delivery"}
          name={name}
          value={value}
          onChange={handleChange}
          disable={disable}
          checked={value}
        />
        <label htmlFor={labelText === "meet up" ? "meetUp" : "delivery"}>
          {labelText || name}
        </label>
      </CheckBoxWrapper>
    )

  if (type === "textarea")
    return (
      <Wrapper>
        <textarea
          id={name}
          name={name}
          rows={5}
          placeholder="Describe what you are selling and include any details a buyer might be interested in. People love items with stories!"
          value={value}
          onChange={handleChange}
        />
      </Wrapper>
    )

  if (type === "password")
    return (
      <Wrapper>
        <input
          type={showPassword ? "text" : type}
          id={name}
          name={name}
          placeholder=" "
          value={value}
          onChange={handleChange}
          disable={disable}
          required
        />
        <label htmlFor={name}>{labelText || name}</label>
        <div className="icon-container" onClick={toggleShowPassword}>
          {value && !showPassword && <AiFillEye className="icon" />}
          {value && showPassword && <AiFillEyeInvisible className="icon" />}
        </div>
      </Wrapper>
    )

  return (
    <Wrapper>
      <input
        type={type}
        id={name}
        name={name}
        placeholder=" "
        value={value}
        onChange={handleChange}
        disable={disable}
      />
      <label htmlFor={name}>{labelText || name}</label>
    </Wrapper>
  )
}
const CheckBoxWrapper = styled.div`
  ${tw`flex items-center gap-1`}

  input {
    ${tw`accent-primary scale-125`}
  }
`

const Wrapper = styled.section`
  ${tw`relative`}

  label {
    ${tw`
      capitalize inline-block px-0.5 text-gray-500
      absolute top-1/2 left-1.5
      -translate-y-1/2 bg-white transition-all
    `}
  }

  /* HIDE BROWSER EYE ICON */
  input::-ms-reveal {
    ${tw`hidden`}
  }

  input,
  textarea {
    ${tw`border-[1px] border-trinary w-full px-2 py-1 rounded-lg resize-none`}
  }

  input:focus ~ label,
  input:not(:placeholder-shown) ~ label {
    ${tw`-translate-y-[3.3rem] text-[14px] text-secondary`}
  }

  .icon {
    ${tw`
      absolute right-1 top-1/2 -translate-y-1/2
      text-2xl cursor-pointer
    `}
  }
`

export default FormRow
