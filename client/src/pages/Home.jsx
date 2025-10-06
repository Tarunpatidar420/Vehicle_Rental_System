import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import CategoriesSection from '../components/CategoriesSection'
import ContactSection from '../components/ContactSection'   // ✅ नया import

const Home = () => {
  return (
    <>
      <Hero />
      <CategoriesSection />   {/* ✅ Modern vehicle categories */}
      <FeaturedSection />
      <Banner />
      {/* ❌ <Testimonial /> remove kar diya */}
      <ContactSection />     {/* ✅ Contact Section jo aapne banaya hai */}
    </>
  )
}

export default Home
