"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt, FaRegEnvelope, FaFacebookF, FaYoutube, FaBars, FaTimes } from "react-icons/fa";
import { siteConfig } from "@/lib/siteConfig";
import { servicesMenu } from "@/lib/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  return (
    <>
      <div className="wt-topbar">
        <div className="wt-topbar-inner">
          <div className="wt-topbar-contact">
            <a href={`tel:${siteConfig.phoneIntl}`}>
              <FaPhoneAlt aria-hidden="true" /> {siteConfig.phoneIntlDisplay}
            </a>
            <a href={`mailto:${siteConfig.email}`}>
              <FaRegEnvelope aria-hidden="true" /> {siteConfig.email}
            </a>
          </div>
          <div className="wt-topbar-socials">
            <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF aria-hidden="true" />
            </a>
            <a href={siteConfig.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
              <FaYoutube aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <header className="wt-header">
        <div className="wt-header-inner">
          <Link href="/" className="wt-logo" onClick={closeMenu}>
            <Image src="/images/logo-new.png" alt={siteConfig.name} width={200} height={47} priority />
          </Link>

          <nav>
            <ul className={menuOpen ? "wt-nav wt-nav-open" : "wt-nav"}>
              <li>
                <Link href="/" onClick={closeMenu}>Home</Link>
              </li>
              <li>
                <Link href="/aboutus/" onClick={closeMenu}>About Us</Link>
              </li>
              <li className={servicesOpen ? "has-open" : undefined}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setServicesOpen((open) => !open);
                  }}
                >
                  Services
                </a>
                <div className="wt-mega">
                  {servicesMenu.map((group) => (
                    <div className="wt-mega-group" key={group.label}>
                      <p className="wt-mega-heading">{group.label}</p>
                      <ul>
                        {group.links.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href} onClick={closeMenu}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </li>
              <li>
                <Link href="/blog/" onClick={closeMenu}>Blog</Link>
              </li>
              <li>
                <Link href="/contact-us/" onClick={closeMenu}>Contact Us</Link>
              </li>
            </ul>
          </nav>

          <div className="wt-nav-actions">
            <a href="/#tiptop-booking-form" className="wt-btn wt-btn-primary" onClick={closeMenu}>
              Book Now
            </a>
            <a href="/#wcb-booking-form" className="wt-btn wt-btn-outline" onClick={closeMenu}>
              Quote
            </a>
            <button
              className="wt-menu-toggle"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
