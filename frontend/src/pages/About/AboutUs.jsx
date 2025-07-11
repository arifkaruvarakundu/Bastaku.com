import React, { useEffect, useState } from "react";
import clutch from "../../images/clutch-dark.png";
import member1 from "../../images/01.jpg";
import member2 from "../../images/02.jpg";
import member3 from "../../images/03.jpg";
// import member4 from "../../images/04.jpg";
import member5 from "../../images/member5.jpg";
import member6 from "../../images/member6.jpg";
import member7 from "../../images/member7.jpg";
import member8 from "../../images/member8.jpg";
import idea from "../../images/idea.gif";
import team from "../../images/team.gif";
import award from "../../images/award.gif";
import flipkartlogo from "../../images/flipkartlogo.png";
import amazonlogo from "../../images/amazonlogo.png";
import blinkit from "../../images/blinkit.png";
import smartshop from "../../images/smartshop.png";
// import bgimage from "../../images/contact-bg.png";
// import cover from "../../images/cover.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import SocialNetworksCarousel from "./SocialNetworksCarousel";
import CaseStudySlider from "./CaseStudySlider";
import { MagnifyingGlass } from "react-loader-spinner";
import { Slide, Zoom } from "react-awesome-reveal";
import ScrollToTop from "../ScrollToTop";
import { useTranslation } from "react-i18next";
import CountUp from 'react-countup';
import StatsCarousel from "../../Component/AboutUs_count";
import { Trans } from 'react-i18next';
import map from "../../images/map.png";
import appstore from "../../images/appstore-btn.svg";
import googleplay from "../../images/googleplay-btn.svg";
import iphone from "../../images/iphone-2.png";

const AboutUs = () => {
  // loading
  const [loaderStatus, setLoaderStatus] = useState(true);
  const { t } = useTranslation('aboutus');

  useEffect(() => {
    setTimeout(() => {
      setLoaderStatus(false);
    }, 1500);
  }, []);

  {/* Shared Styles */}
  const containerClass = "grid md:grid-cols-2 gap-8 items-center";
  const imageClass = "w-full h-[350px] object-cover rounded-xl shadow-lg";
  const textClass = "max-w-xl";

  return (
    <div>
      <div>
        {loaderStatus ? (
          <div className="loader-container">
            {/* <PulseLoader loading={loaderStatus} size={50} color="#0aad0a" /> */}
            <MagnifyingGlass
              visible={true}
              height="100"
              width="100"
              ariaLabel="magnifying-glass-loading"
              wrapperStyle={{}}
              wrapperclassName="magnifying-glass-wrapper"
              glassColor="#c0efff"
              color="#0aad0a"
            />
          </div>
        ) : (
          <>
          <>
          <ScrollToTop/>
          </>
            <>
              {/* Hero */}
              <section className="position-relative pt-5">
                {/* Background */}
                <div
                  className="position-absolute top-0 start-0 w-100 bg-position-bottom-center bg-size-cover bg-repeat-0"
                  style={{
                    backgroundImage: "url(assets/img/about/hero-bg.svg)",
                  }}
                >
                  <div className="d-lg-none" style={{ height: 960 }} />
                  <div className="d-none d-lg-block" style={{ height: 768 }} />
                </div>
                {/* Content */}
                <div className="container position-relative zindex-5 pt-5">
                  <div className="row">
                    <div className="col-lg-6">
                      {/* Breadcrumb */}

                      {/* Text */}
                      <Slide direction="down">
                      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t("about_bastaku")}</h1>
                      <h3 className="pb-2 pb-md-3">{t("tagline")}</h3>
                      <p
                        className="fs-xl pb-4 mb-1 mb-md-2 mb-lg-3"
                        // style={{ maxWidth: 526 }}
                        style={{ fontSize: '1.125rem', color: '#4B5563' }}
                      >
                      {t("about_description")}
                      </p>
                      <img
                        src={clutch}
                        className="d-dark-mode-none"
                        width={175}
                        alt="Clutch"
                      />
                      <img
                        src="assets/img/about/clutch-light.png"
                        className="d-none d-dark-mode-block"
                        width={175}
                        alt="Clutch"
                      />
                      
                      </Slide>
                    </div>
                    {/* Images */}
                    <div className="col-lg-6 mt-xl-3 pt-5 pt-lg-4">
                      <div className="row row-cols-2 gx-3 gx-lg-4">
                        <div className="col pt-lg-5 mt-lg-1">
                          <Zoom>
                          <img
                            src={member1}
                            className="d-block rounded-3 mb-3 mb-lg-4"
                            alt="member"
                          />
                          </Zoom>
                          {/* <img
                      src={member2}
                      className="d-block rounded-3"
                     alt="member"
                    /> */}
                        </div>
                        <div className="col">
                          <Zoom>
                          <img
                            src={member3}
                            className="d-block rounded-3 mb-3 mb-lg-4"
                            alt="member"
                          />
                          </Zoom>
                          {/* <img
                      src={member4}
                      className="d-block rounded-3"
                     alt="member"
                    /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
            <>
              <section className="container mt-8 mb-5 pt-lg-5" id="benefits">
                  <StatsCarousel />
                <Swiper
                  className="swiper pt-3 mt-8"
                  modules={[]} // Use the modules prop to include the Pagination module
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  breakpoints={{
                    500: { slidesPerView: 2 },
                    991: { slidesPerView: 3 },
                  }}
                >
                  {/* <div className="swiper-wrapper pt-4">
                    
                    <SwiperSlide className="swiper-slide border-end-lg px-2">
                      <div className="text-center">
                        <Zoom>
                        <img
                          src={idea}
                          width="100"
                          alt="Bulb icon"
                          className="d-block mb-4 mx-auto"
                        />
                        </Zoom>
                        <Slide direction="up">
                        <h4 className="mb-2 pb-1">{t("creative_solutions")}</h4>
                        <p className="mx-auto" style={{ maxWidth: "336px" }}>
                          Sed morbi nulla pulvinar lectus tempor vel euismod
                          accumsan.
                        </p>
                        </Slide>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide border-end-lg px-2">
                      <div className="text-center">
                        <Zoom>
                        <img
                          src={award}
                          width="100"
                          alt="Award icon"
                          className="d-block mb-4 mx-auto"
                        />
                        </Zoom>
                        <Slide direction="up">
                        <h4 className="mb-2 pb-1">{t("award_winning")}</h4>
                        <p className="mx-auto" style={{ maxWidth: "336px" }}>
                          Sit facilisis dolor arcu, fermentum vestibulum arcu
                          elementum imperdiet.
                        </p>
                        </Slide>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide className="swiper-slide px-2">
                      <div className="text-center">
                        <Zoom>
                        <img
                          src={team}
                          width="100"
                          alt="Team icon"
                          className="d-block mb-4 mx-auto"
                        />
                        </Zoom>
                        <Slide direction="up">
                        <h4 className="mb-2 pb-1">{t("team_of_professionals")}</h4>
                        <p className="mx-auto" style={{ maxWidth: "336px" }}>
                          Nam venenatis urna aenean quis feugiat et senectus
                          turpis.
                        </p>
                        </Slide>
                      </div>
                    </SwiperSlide>
                  </div> */}
                  <div className="swiper-pagination position-relative pt-2 pt-sm-3 mt-4"></div>
                </Swiper>
              </section>
            </>
            <>
              {/* Video showreel */}
              {/* <section className="container text-center pb-5 mt-n2 mt-md-0 mb-md-2 mb-lg-4">
          <div className="position-relative rounded-3 overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center zindex-5">
              <a
                href="https://www.youtube.com/watch?v=zPo5ZaH6sW8"
                className="btn btn-video btn-icon btn-xl stretched-link bg-white"
                data-bs-toggle="video"
              >
                <i className="bx bx-play" />
              </a>
            </div>
            <span className="position-absolute top-0 start-0 w-100 h-100  opacity-35" />
            <img
              src={cover}
              className="d-block w-100"
              alt="Cover "
            />
          </div>
        </section> */}
              {/* Gallery */}
              <section style={{ maxWidth: '1500px', margin: '0 auto', padding: '4rem 1rem' }}>
              {/* Section 1: Text Left, Image Right */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                <div style={{ flex: '3 1 75%', maxWidth: '1000px' }}>
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t("our_mission")}</h2>
                  <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>{t("our_mission_description")}</p>
                </div>
                {/* Image Section */}
                  <div style={{ flex: '1 1 25%', display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={member2}
                      alt="Mission"
                      style={{
                        width: '100%',
                        maxWidth: '350px',
                        height: 'auto',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </div>

      {/* Section 2: Image Left, Text Right */}
      <div style={{ flex: '1 1 25%', display: 'flex', justifyContent: 'center' }}>
        <img 
          src={member5} 
          alt="Buyers" 
          style={{
            width: '100%',
            maxWidth: '350px',
            height: 'auto',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            objectFit: 'cover'
          }} 
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
        <div style={{ flex: '3 1 75%', maxWidth: '1000px', marginLeft: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t("what_we_offer_buyers")}</h2>
          <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>{t("what_we_offer_buyers_description")}</p>
          </div>
        </div>
      </div>

      {/* Section 3: Text Left, Image Right */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', marginTop: '4rem' }}>
        <div style={{ flex: '3 1 75%', maxWidth: '1000px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t("what_we_offer_suppliers")}</h2>
          <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>{t("what_we_offer_suppliers_description")}</p>
        </div>
        <div style={{ flex: '1 1 25%', display: 'flex', justifyContent: 'center' }}>
        <img 
          src={member6} 
          alt="Suppliers" 
          style={{
            width: '100%',
            maxWidth: '350px',
            height: 'auto',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            objectFit: 'cover'
          }}
          />
        </div>
      </div>

      {/* Section 4: Image Left, Text Right */}
      <div style={{ flex: '1 1 25%', display: 'flex', justifyContent: 'center' }}>
        <img 
          src={member7} 
          alt="Vision" 
          className={imageClass} 
          style={{
            width: '100%',
            maxWidth: '350px',
            height: 'auto',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            objectFit: 'cover'
          }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', marginLeft: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t("our_vision")}</h2>
          <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>{t("our_vision_description")}</p>
        </div>
      </div>

      {/* Section 5: Text Left, Image Right */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
        <div style={{ flex: '3 1 75%', maxWidth: '1000px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t("why_we're_different")}</h2>
          <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>{t("why_we're_different_description")}</p>
        </div>
        <img 
          src={member8} 
          alt="Why We're Different" 
          style={{
            width: '100%',
            maxWidth: '350px',
            height: 'auto',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            objectFit: 'cover'
          }} 
        />
      </div>

      {/* Section 6: Image Left, Text Right */}
      <div style={{ flex: '1 1 25%', display: 'flex', justifyContent: 'center' }}>
        <img 
          src={member5} 
          alt="Closing" 
          style={{
            width: '100%',
            maxWidth: '350px',
            height: 'auto',
            borderRadius: '1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            objectFit: 'cover'
          }} 
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', marginLeft: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>{t("in_closing")}</h2>
          <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>{t("in_closing_description")}</p>
        </div>
      </div>
    </section>
            </>
            <>
              {/* Awards */}
              <section className="container mt-8 mb-5 pb-3 pb-md-4 pb-lg-5">
                <div className="row gy-4 py-xl-2">
                  <div className="col-md-4">
                    {/* <h2 className="mb-0 text-md-start text-center">Our Partners</h2> */}
                    <div className="info-whydiff">
                      <div className="section-title-left pt-80">
                        <h3 className="party" style={{ fontSize: "38px" }}>
                          <Slide direction="down" delay={0.5}>
                          {t("our_partners")}
                          </Slide>
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7 offset-lg-1 col-md-8">
                    <div className="row row-cols-sm-4 row-cols-2 gy-4">
                      <div className="col">
                        <div className="position-relative text-center">
                          <Zoom>
                          <img
                            src={flipkartlogo}
                            width={100}
                            alt="Webby"
                            className="d-block mx-auto mb-3"
                          />
                          </Zoom>
                          <Link
                            to="#"
                            className="text-body justify-content-center fs-sm stretched-link text-decoration-none"
                          >
                            4x mobile of the day
                          </Link>
                        </div>
                      </div>
                      <div className="col">
                        <div className="position-relative text-center">
                          <Zoom>
                          <img
                            src={amazonlogo}
                            width={100}
                            alt="CSSDA"
                            className="d-block mx-auto mb-3"
                          />
                          </Zoom>
                          <Link
                            to="#"
                            className="text-body justify-content-center fs-sm stretched-link text-decoration-none"
                          >
                            1x Kudos
                          </Link>
                        </div>
                      </div>
                      <div className="col">
                        <div className="position-relative text-center">
                          <Zoom>
                          <img
                            src={blinkit}
                            width={100}
                            // height={57}
                            alt="Awwwards"
                            className="d-block mx-auto mb-3"
                          />
                          </Zoom>
                          <Link
                            to="#"
                            className="text-body justify-content-center fs-sm stretched-link text-decoration-none"
                          >
                            3x website of the day
                          </Link>
                        </div>
                      </div>
                      <div className="col">
                        <div className="position-relative text-center">
                          <Zoom>
                          <img
                            src={smartshop}
                            width={100}
                            alt="FWA"
                            className="d-block mx-auto mb-3"
                          />
                          </Zoom>
                          <Link
                            to="#"
                            className="text-body justify-content-center fs-sm stretched-link text-decoration-none"
                          >
                            2x best website
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
            <>
              <CaseStudySlider />
            </>
            {/* <> */}
              {/* Contact form */}
              {/* <section className="container pb-5 mb-2 mt-8 mb-md-4 mb-lg-5">
                <div className="position-relative bg-secondaryy rounded-3 py-5 mb-2">
                  <div className="row pb-2 py-md-3 py-lg-5 px-4 px-lg-0 position-relative zindex-3">
                    <div className="col-xl-3 col-lg-4 col-md-5 offset-lg-1">
                      <Slide direction="down" delay={0.5}>
                      <p className="lead mb-2 mb-md-3">Ready to get started?</p>
                      <h2 className="h1 pb-3">Don’t Hesitate to Contact Us</h2>
                      </Slide>
                    </div>
                    <form
                      className="col-lg-6 col-md-7 offset-xl-1 zindex-3 needs-validation"
                      noValidate
                    >
                      <div className="row">
                        <div className="col-sm-6 mb-4">
                          <label htmlFor="name" className="form-label fs-base">
                            Full name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="form-control form-control-lg"
                            required
                          />
                          <div className="invalid-feedback">
                            Please enter your name!
                          </div>
                        </div>
                        <div className="col-sm-6 mb-4 zindex-3">
                          <label htmlFor="email" className="form-label fs-base">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="form-control form-control-lg"
                            required
                          />
                          <div className="invalid-feedback">
                            Please provide a valid email address!
                          </div>
                        </div>
                        <div className="col-12 pb-2 mb-4">
                          <label
                            htmlFor="message"
                            className="form-label fs-base"
                          >
                            Message
                          </label>
                          <textarea
                            id="message"
                            className="form-control form-control-lg"
                            rows={4}
                            required
                            defaultValue={""}
                          />
                          <div className="invalid-feedback">
                            Please enter your message!
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        className="btn btn-primary shadow-primary btn-lg"
                      >
                        Send request
                      </button>
                       
                    </form>
                  </div> */}
                  {/* Pattern */}
                  {/* <div className="position-absolute end-0 bottom-0 text-primary">
              <svg
                width={416}
                height={444}
                viewBox="0 0 416 444"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.08"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M240.875 615.746C389.471 695.311 562.783 640.474 631.69 504.818C700.597 369.163 645.201 191.864 496.604 112.299C348.007 32.7335 174.696 87.5709 105.789 223.227C36.8815 358.882 92.278 536.18 240.875 615.746ZM208.043 680.381C388.035 776.757 605.894 713.247 694.644 538.527C783.394 363.807 709.428 144.04 529.436 47.6636C349.443 -48.7125 131.584 14.7978 42.8343 189.518C-45.916 364.238 28.0504 584.005 208.043 680.381Z"
                  fill="currentColor"
                />
                <path
                  opacity="0.08"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M262.68 572.818C382.909 637.194 526.686 594.13 584.805 479.713C642.924 365.295 595.028 219.601 474.799 155.224C354.57 90.8479 210.793 133.912 152.674 248.33C94.5545 362.747 142.45 508.442 262.68 572.818ZM253.924 590.054C382.526 658.913 538.182 613.536 601.593 488.702C665.004 363.867 612.156 206.847 483.554 137.988C354.953 69.129 199.296 114.506 135.886 239.341C72.4752 364.175 125.323 521.195 253.924 590.054Z"
                  fill="currentColor"
                />
              </svg>
            </div> */}
                {/* </div>
              </section>
            </> */}
            <>
                          {/* cta section */}
                          <section className="container mt-8 mb-5 pt-lg-5">
                            <div className="coming-soon"><Trans>coming_soon</Trans></div>
                            <div
                              className="container"
                              style={{
                                background: `url(${map})no-repeat`,
                                backgroundSize: "cover",
                              }}
                            >
                              {/* <hr className="my-lg-14 my-8"> */}
                              {/* row */}
                              <div className="row align-items-center text-center justify-content-center">
                                <div className=" col-lg-6 col-md-6 fade-in-left">
                                  <Slide direction="left">
                                    <div className="mb-6">
                                      <div className="mb-7">
                                        {/* heading */}
                                        <h1><Trans>get_app</Trans></h1>
                                        <h5 className="mb-0">
                                          <Trans>get_app_description</Trans>
                                        </h5>
                                      </div>
                                      <div className="mb-5">
                                        {/* form check */}
                                        <div className="form-check form-check-inline">
                                          <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="flexRadioDefault1"
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor="flexRadioDefault1"
                                          >
                                            Email
                                          </label>
                                        </div>
                                        {/* form check */}
                                        <div className="form-check form-check-inline">
                                          <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="flexRadioDefault2"
                                            defaultChecked
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor="flexRadioDefault2"
                                          >
                                            Phone
                                          </label>
                                        </div>
                                        {/* form */}
                                        {/* <form className="row g-3 mt-2">
            
                      
                                          <div className="col-6 ">
                                            
                                            <input type="text" className="form-control" placeholder="Phone">
                                          </div>
                                          
                                          <div className="col-6">
                                            <button type="submit" className="btn btn-primary mb-3">Share app link</button>
                                          </div>
                                        </form> */}
                                      </div>
                                      <div>
                                        {/* app */}
                                        {/* <small>Download app from</small> */}
            
                                        <ul className="list-inline mb-0 mt-2 ">
                                          {/* list item */}
                                          <li className="list-inline-item">
                                            {/* img */}
                                            <Link to="#!">
                                              {" "}
                                              <img
                                                src={appstore}
                                                alt="appstore"
                                                style={{ width: 140 }}
                                              />
                                            </Link>
                                          </li>
                                          <li className="list-inline-item">
                                            {/* img */}
                                            <Link to="#!">
                                              {" "}
                                              <img
                                                src={googleplay}
                                                alt="googleplay"
                                                style={{ width: 140 }}
                                              />
                                            </Link>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </Slide>
                                </div>
                                <div className=" offset-lg-2 col-lg-4 col-md-6 fade-zoom">
                                  <Slide direction="right">
                                    <div className="text-lg-start">
                                      {/* img */}
                                      <img
                                        src={iphone}
                                        alt="iphone"
                                        className=" img-fluid"
                                      />
                                    </div>
                                  </Slide>
                                </div>
                              </div>
                              {/* <hr className="my-lg-14 my-8"> */}
                            </div>
                          </section>
                        </>
            <>
              <SocialNetworksCarousel />
            </>
          </>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
