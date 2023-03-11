import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { FormRow, SelectInput } from "../components"
import { conditionList, navLinks } from "../utils/links"
import {
  createListing,
  updateListing,
} from "../features/singleListing/singleListingSlice"

const CreateListingForm = ({ uploadedPhotos }) => {
  // because I need to pass handleChange() to <FormRow> so I can't just use redux state, since I need to dispatch the actions
  const { listing, removedPhotos, isLoading } = useSelector(
    (store) => store.singleListing
  )
  const [values, setValues] = useState(listing)
  const { category, name, brand, condition, price, description, dealMethod } =
    values
  const dispatch = useDispatch()
  const { id } = useParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    /*
    ===================================================
    PUT PHOTOS IN <File> FORMAT IN FORMDATA TO UPLOAD TO CLOUDINARY
    ===================================================
    */
    let formData = new FormData()
    if (uploadedPhotos.length > 0) {
      uploadedPhotos.forEach((photo) => {
        formData.append(`photo`, photo)
      })
    }

    /*
    ===================================================
    SINCE SHARE THE SAME FORM FOR CREATE LISTING AND UPDATE LISTING
    DEPENDS ON IF SINGLE LISTING IN REDUX OR NOT
    ===================================================
    */
    listing._id
      ? dispatch(
          updateListing({
            listing: values,
            photos: formData,
            removedPhotos,
            id,
          })
        )
      : dispatch(
          createListing({
            listing: values,
            photos: formData,
          })
        )
  }

  const handleChange = (e) => {
    const { name, value, id } = e.target

    name === "dealMethod"
      ? setValues((prev) => ({
          ...prev,
          dealMethod: { ...prev.dealMethod, [id]: !prev.dealMethod[id] },
        }))
      : setValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Wrapper onSubmit={handleSubmit}>
      <SelectInput
        name="category"
        category={category.name}
        handleChange={handleChange}
        links={navLinks}
        type="create"
      />
      <FormRow
        type="text"
        name="name"
        labelText="listing title"
        value={name}
        handleChange={handleChange}
      />
      <h2>About the item</h2>
      <FormRow
        type="text"
        name="brand"
        value={brand}
        handleChange={handleChange}
      />
      <div className="condition">
        <div className="options">
          {conditionList.map((option, i) => (
            <button
              type="button"
              key={i}
              className={`btn btn-outline ${condition === option && "active"}`}
              onClick={() => {
                setValues((prev) => ({ ...prev, condition: option }))
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <FormRow
        type="text"
        name="price"
        value={price}
        handleChange={handleChange}
      />
      <FormRow
        type="textarea"
        name="description"
        value={description}
        handleChange={handleChange}
      />
      <h2>deal method</h2>
      <div className="checkbox">
        <FormRow
          type="checkbox"
          name="dealMethod"
          labelText="meet up"
          value={dealMethod.meetUp}
          handleChange={handleChange}
        />
        <FormRow
          type="checkbox"
          name="dealMethod"
          labelText="mailing & delivery"
          value={dealMethod.delivery}
          handleChange={handleChange}
        />
      </div>
      <button className="btn btn-primary" disabled={isLoading}>
        {listing._id ? "update list" : "list now"}
      </button>
    </Wrapper>
  )
}

const Wrapper = styled.form`
  ${tw`
    bg-white w-full mt-3 py-3 space-y-2.5
    border-t border-gray-400
    lg:(border-l border-t-0 pl-3 mt-0) 
  `}

  h2 {
    ${tw`text-2xl font-semibold`}
  }

  .options {
    ${tw`flex gap-x-2 gap-y-1 flex-wrap`}
  }

  .checkbox {
    ${tw`space-y-1`}
  }

  button.btn-primary {
    ${tw`py-1 px-3`}

    &:disabled {
      ${tw`bg-gray-500 text-gray-700`}
    }
  }
`
export default CreateListingForm
