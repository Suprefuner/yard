// DETERMINE DESKTOP OR MOBILE DEVICE
export const isDesktop = () => {
  return window.innerWidth >= 1024
}

const checkIsImage = (file) => {
  if (!file.type.startsWith("image/"))
    throw new Error("only image, please try again")
}

export const showImage = (file, Fn) => {
  let fileURL
  /* 
  ======================================================================  
  FOR MULTIPLE IMAGES UPLOAD
  ======================================================================  
  */
  if (!!file.forEach) {
    if (file.length > 10) {
      throw new Error("max upload 10 images, over 10 images, please try again")
    }

    file.forEach((image) => {
      checkIsImage(image)

      // CREATE NEW FILEREADER FOR EACH IMAGE TO PREVENT OVERLOAD
      let fileReader = new FileReader()
      fileReader.readAsDataURL(image)
      fileReader.onload = () => {
        Fn((prev) => [...prev, { publicId: "", url: fileReader.result }])
      }
    })
  } else {
    /* 
  ======================================================================  
  FOR SINGLE IMAGE UPLOAD
  ======================================================================  
  */
    checkIsImage(file)

    let fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileURL = fileReader.onload = () =>
      Fn({ publicId: "", url: fileReader.result })
  }
}
