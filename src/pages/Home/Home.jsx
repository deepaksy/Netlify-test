import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaDumbbell, FaCrown, FaCheckCircle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt
} from "react-icons/fa";
import { useTranslation, Trans } from "react-i18next";
import "./Home.css"; 

// List of supported languages (add to or edit these as needed)
const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" }
];

const trainers = [
  {
    id: 1,
    name: "Alex Pill",
    expertise: "Strength & Conditioning",
    certifications: ["NSCA-CSCS", "ACE Certified"],
    photo: "../../../public/images/Trainer1.png",
  },
  {
    id: 2,
    name: "Ashley Smith",
    expertise: "Bodybuilding, Nutrition",
    certifications: ["ISSA Master Trainer", "IFBB Pro"],
    photo: "../../../public/images/Trainer2.png",
  },
  {
    id: 3,
    name: "John King",
    expertise: "Muscle Building, Fat Loss",
    certifications: ["NASM CPT", "S&C Specialist"],
    photo: "../../../public/images/Trainer3.png",
  },
  {
    id: 4,
    name: "Priya Aggarwal",
    expertise: "Yoga, MentalHealth",
    certifications: ["Yoga International", "CPR AED"],
    photo: "../../../public/images/Trainer4.png",
  }
];

const Home = () => {
  const [plans, setPlans] = useState([]);
  const [hoveredIdx, setHoveredIdx] = useState(-1);

  const { t, i18n } = useTranslation();

  // For language dropdown value
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  useEffect(() => {
    axios
      .get("http://localhost:8080/subscriptions")
      .then((res) => setPlans(res.data))
      .catch((err) => console.error("Error fetching plans:", err));
  }, []);

  // Handle language change from dropdown
  const handleLanguageChange = (e) => {
    const lng = e.target.value;
    setSelectedLang(lng);
    i18n.changeLanguage(lng);
  };

  const formatAccessLabel = (access) =>
    access
      ? access
          .toLowerCase()
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "";

  return (
    <div className="home__container">

      <div style={{ textAlign: "right", margin: "1em 1em 0 0" }}>
        <select
          value={selectedLang}
          onChange={handleLanguageChange}
          style={{ padding: "0.4em", borderRadius: "4px" }}
        >
          {languages.map((lng) => (
            <option key={lng.code} value={lng.code}>
              {lng.label}
            </option>
          ))}
        </select>
      </div>

      {/* HERO SECTION */}
      <header className="hero-section">
        <div>
          <h1 className="home__title">
            <Trans
              i18nKey="hero.title"
              values={{
                brand: t("app.brand"),
                fitness: t("app.fitness")
              }}
              components={{ accent: <span className="accent" /> }}
            />
          </h1>
          <div className="home__subtitle">
            <FaDumbbell style={{
              marginRight: 10,
              fontSize: "1.12em",
              color: "#1976D2",
            }} />
            {t("hero.subtitle")}
          </div>
          <Link to="/auth/signin" className="cta-btn">
            {t("hero.cta")}
          </Link>
        </div>
      </header>

      {/* PLANS SECTION */}
      <section id="plans" style={{ marginBottom: "2.7rem" }}>
        <h2 className="home__section-title">{t("plans.title")}</h2>
        <div className="plans-grid">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              className="plan-card"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(-1)}
              tabIndex={0}
            >
              {idx === 1 && (
                <span className="plan-badge">
                  <FaCrown style={{ marginRight: 6, color: "#1766c2" }} /> {t("plans.mostPopular")}
                </span>
              )}
              <div className="plan-title">{plan.name}</div>
              <div className="plan-desc">{plan.description}</div>
              <ul className="plan-features">
                <li>
                  <span className="dot" /> <b>{t("plans.features.access")}</b>: {formatAccessLabel(plan.access)}
                </li>
               <li>
                  <span className="dot" /> <b>{t("plans.features.diet")}</b>: {plan.dietConsultation ? t("plans.yes") : t("plans.no")}
                </li>
                <li>
                  <span className="dot" /> <b>{t("plans.features.sauna")}</b>: {plan.sauna ? t("plans.yes") : t("plans.no")}
                </li>
               <li>
                  <span className="dot" /> <b>{t("plans.features.duration")}</b>: {plan.duration} {t("plans.mo")}
                </li>
              </ul>
              <div className="plan-price-row">
                <span className="plan-price">₹{plan.price}</span>
              </div>
              <div className="plan-btn-group">
                <Link to="/auth/signin" className="join-btn">
                  {t("plans.choosePlan")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRAINERS SECTION */}
      <section id="trainers" style={{ marginBottom: "2.7rem" }}>
        <h2 className="home__section-title">{t("trainers.title")}</h2>
        <div className="trainers-grid">
          {trainers.map((t) => (
            <div key={t.id} className="trainer-card equalize-trainers" tabIndex={0}>
              <div className="trainer-photo-wrap">
                <img src={t.photo} alt={t.name} className="trainer-photo" />
              </div>
              <div className="trainer-info">
                <div className="trainer-name">{t.name}</div>
                <div className="trainer-expertise">{t.expertise}</div>
                <ul className="trainer-certs">
                  {t.certifications.map((c, i) => (
                    <li key={i}>
                      <FaCheckCircle
                        style={{
                          color: "#1976D2",
                          marginRight: 5,
                          fontSize: "1.1em",
                          verticalAlign: "-2px",
                        }}
                      />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section className="about-contact-section" id="about" style={{ margin: "2rem 0 0 0" }}>
        <div className="about-box">
          <h2 className="about-title">{t("about.title")}</h2>
          <Trans
            i18nKey="about.content"
            values={{ brand: t("app.brand"), fitness: t("app.fitness") }}
            components={{ b: <b /> }}
          />
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section className="about-contact-section" id="contact" style={{ margin: "2rem 0 0 0" }}>
        <div className="contact-box">
          <h2 className="about-title">{t("contact.title")}</h2>
          <ul className="contact-list">
            <li>
              <FaPhoneAlt className="contact-icon" />
              <b>{t("contact.phone")}:</b>&nbsp;
              <a href="tel:+912012345678">+91 20 1234 5678</a>
            </li>
            <li>
              <FaEnvelope className="contact-icon" />
              <b>{t("contact.email")}:</b>&nbsp;
              <a href="mailto:info@gymmate.in">info@gymmate.in</a>
            </li>
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <b>{t("contact.address")}:</b>
              <span>
                {t("footer.address")}
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="main-footer">
        <div>
          <div className="footer-brand">
            <span className="accent footer-logo-txt">{t("app.brand")}</span> {t("app.fitness")} &nbsp;|&nbsp;
            <span style={{ color: "#1976D2", fontWeight: 500 }}>
              {t("footer.location")}
            </span>
          </div>
          <div className="footer-address">
            {t("footer.address")}
          </div>
          <div className="footer-copy">
            {t("footer.copyright", {
              year: new Date().getFullYear(),
              brand: t("app.brand")
            })}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
