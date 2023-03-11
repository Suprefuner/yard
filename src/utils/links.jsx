import { HiOutlineDesktopComputer } from "react-icons/hi"
import { RiShirtLine } from "react-icons/ri"
import { MdOutlineSmartToy } from "react-icons/md"
import { TbCar } from "react-icons/tb"
import { BsTwitter, BsInstagram } from "react-icons/bs"
import { FaFacebookF } from "react-icons/fa"

/*
=========================================================
NAVBAR LINKS
=========================================================
*/
export const navLinks = [
  {
    url: "/electronics",
    text: "electronics",
    icon: <HiOutlineDesktopComputer />,
    subLinks: [
      "computer & tech",
      "mobile phones & gadgets",
      "TV & home appliances",
    ],
  },
  {
    url: "/fashion",
    text: "fashion",
    icon: <RiShirtLine />,
    subLinks: ["apparel", "watches", "sneakers & footwear"],
  },
  {
    url: "/toy",
    text: "toy",
    icon: <MdOutlineSmartToy />,
    subLinks: ["trading card", "figure", "video games"],
  },
  {
    url: "/car",
    text: "car",
    icon: <TbCar />,
    subLinks: ["car"],
  },
  {
    url: "/listing",
    text: "all",
  },
]

/*
=========================================================
HOME PAGE BANNERS
=========================================================
*/
import homeBanner1 from "../assets/banner/home_banner_1.jpg"
import homeBanner2 from "../assets/banner/home_banner_2.jfif"
import homeBanner3 from "../assets/banner/home_banner_3.jpg"
import homeBanner4 from "../assets/banner/home_banner_4.jpg"

export const homeBanners = [homeBanner1, homeBanner2, homeBanner3, homeBanner4]

/*
=========================================================
CATEGORY PAGE BANNERS
=========================================================
*/
import electronicsBanner from "../assets/banner/category_banner_electronics.jpg"
import fashionBanner from "../assets/banner/category_banner_fashion.jpg"
import toyBanner from "../assets/banner/category_banner_toy.jpg"
import carBanner from "../assets/banner/category_banner_car.jpg"

export const categoryBanners = {
  electronics: electronicsBanner,
  fashion: fashionBanner,
  toy: toyBanner,
  car: carBanner,
}
/*
=========================================================
FOOTER DATA
=========================================================
*/
export const socialMediaIcons = [
  {
    url: "https://twitter.com/",
    icon: <BsTwitter />,
  },
  {
    url: "https://www.instagram.com/",
    icon: <BsInstagram />,
  },
  {
    url: "https://www.facebook.com/",
    icon: <FaFacebookF />,
  },
]

export const footerLinks = [
  {
    url: "/company",
    text: "company",
  },
  {
    url: "/about-us",
    text: "about us",
  },
  {
    url: "/contact-us",
    text: "contact us",
  },
  {
    url: "/faq",
    text: "FAQ",
  },
]

/*
=========================================================
FOOTER
=========================================================
*/
export const filterOptions = [
  "category",
  "condition",
  "price",
  "trade method",
  "clear all",
  "more filter",
]

export const conditionList = [
  "brand new",
  "like new",
  "lightly used",
  "well used",
  "heavily used",
]

export const sortList = [
  "latest",
  "oldest",
  "price - high to low",
  "price - low to high",
]

/*
=========================================================
INPUT TYPE FOR <FormRow> COMPONENT
=========================================================
*/
export const inputType = {
  username: {
    type: "text",
  },
  firstName: {
    type: "text",
    labelText: "first name",
  },
  lastName: {
    type: "text",
    labelText: "last name",
  },
  description: {
    type: "textarea",
  },
  password: {
    type: "password",
  },
  newPassword: {
    type: "password",
    labelText: " new password",
  },
  newPasswordConfirm: {
    type: "password",
    labelText: "confirm new password",
  },
  email: {
    type: "email",
  },
  gender: {
    type: "select",
  },
  birthday: {
    type: "date",
  },
}

/*
=========================================================
CATEGORY PAGE
=========================================================
*/
// import computerPhoto from "../assets/category/electronics/computer-&-tech.png"
// import mobilePhonePhoto from "../assets/category/electronics/mobile-phones-&-gadgets.png"
// import tvPhoto from "../assets/category/electronics/TV-&-home-appliances.png"
// import apparelPhoto from "../assets/category/fashion/apparel.png"
// import watchesPhoto from "../assets/category/fashion/watches.png"
// import sneakerPhoto from "../assets/category/fashion/sneakers-&-footwear.png"
// import cardPhoto from "../assets/category/toy/trading-card.png"
// import figurePhoto from "../assets/category/toy/figure.png"
// import videoGamesPhoto from "../assets/category/toy/video-games.png"
// import toyotaLogo from "../assets/category/cars/toyota.png"
// import subaruLogo from "../assets/category/cars/subaru.png"
// import nissanLogo from "../assets/category/cars/nissan.png"
// import bmwLogo from "../assets/category/cars/bmw.png"
// import benzLogo from "../assets/category/cars/benz.png"
// import audiLogo from "../assets/category/cars/audi.png"
// import porscheLogo from "../assets/category/cars/porsche.png"
// import ferrariLogo from "../assets/category/cars/ferrari.png"
// import lamborghiniLogo from "../assets/category/cars/lamborghini.png"

export const categoryPropsList = {
  electronics: [
    {
      text: "computer & tech",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464516/category%20images/computer-_-tech_nwdwf3.png",
    },
    {
      text: "mobile phones & gadgets",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464516/category%20images/mobile-phones-_-gadgets_tiporu.png",
    },
    {
      text: "TV & home appliances",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464516/category%20images/TV-_-home-appliances_ombhrk.png",
    },
  ],
  fashion: [
    {
      text: "apparel",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464523/category%20images/apparel_wfdfpy.png",
    },
    {
      text: "watches",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464523/category%20images/watches_trx8ns.png",
    },
    {
      text: "sneakers & footwear",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464523/category%20images/sneakers-_-footwear_fvrlek.png",
    },
  ],
  toy: [
    {
      text: "trading card",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464529/category%20images/trading-card_bub067.png",
    },
    {
      text: "figure",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464529/category%20images/figure_pgk6ed.png",
    },
    {
      text: "video games",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464529/category%20images/video-games_q8r0pa.png",
    },
  ],
  car: [
    {
      text: "toyota",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464512/category%20images/toyota_w9h3en.png",
    },
    {
      text: "subaru",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464512/category%20images/subaru_gs3ijt.png",
    },
    {
      text: "nissan",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464511/category%20images/nissan_x0aesz.png",
    },
    {
      text: "BMW",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464510/category%20images/bmw_s7w5dk.png",
    },
    {
      text: "mercedes benz",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464511/category%20images/benz_mtppkj.png",
    },
    {
      text: "audi",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464511/category%20images/audi_lweppz.png",
    },
    {
      text: "porsche",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464511/category%20images/porsche_weqoyj.png",
    },
    {
      text: "ferrari",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464510/category%20images/ferrari_otcinz.png",
    },
    {
      text: "lamborghini",
      photo:
        "https://res.cloudinary.com/dytia9net/image/upload/v1678464511/category%20images/lamborghini_j01j1w.png",
    },
  ],
}
