import React from "react";

import { MdOutlineContactSupport } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaBinoculars } from "react-icons/fa";

import "./Footer.css";

export default function Footer() {
  return (
    <>
      <div className="footer-break"></div>
      <div className="footer-banner"></div>
      <footer className="footer-container">
        <div className="footer-field">
          <h3>Meadowlark Bird Sighting Database</h3>
          <div className="footer-icons">
            <div className="footer-icon">
              <MdOutlineContactSupport size={30} />
              <p>Support</p>
            </div>
            <div className="footer-icon">
              <FaYoutube size={30} />
              <p>Demo</p>
            </div>
            <div className="footer-icon">
              <FaLaptopCode size={30} />
              <p>Source Code</p>
            </div>
          </div>
        </div>
        <FaBinoculars size={50} id="binIcon" />

        <div className="footer-field">
          <h3>Created by Tony Kovatch</h3>
          <div className="footer-icons">
            <div className="footer-icon">
              <FaLinkedin size={30} />
              <p>LinkedIn</p>
            </div>
            <div className="footer-icon">
              <FaGithub size={30} />
              <p>GitHub</p>
            </div>
            <div className="footer-icon">
              <MdEmail size={30} />
              <p>Contact</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
