import React from "react";
import { useLocation } from "react-router-dom";

import { MdOutlineContactSupport } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaBinoculars } from "react-icons/fa";

import "./Footer.css";

export default function Footer() {
  let location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <div className="footer-break"></div>}
      <div className="footer-banner"></div>
      <footer className="footer-container">
        <div className="footer-field">
          <h3>Meadowlark Bird Sighting Database</h3>
          <div className="footer-icons">
            <div className="footer-icon">
              <a href="mailto:Anthonykovatch@gmail.com">
                <MdOutlineContactSupport size={30} />
              </a>
              <p>Support</p>
            </div>
            <div className="footer-icon">
              <a
                href="https://github.com/Akovatch/meadowlark-birding-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLaptopCode size={30} />
              </a>
              <p>Source Code</p>
            </div>
            <div className="footer-icon">
              <a
                href="https://www.youtube.com/watch?v=429vVZc4nS0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube size={30} />
              </a>
              <p>Demo</p>
            </div>
          </div>
        </div>
        <FaBinoculars size={50} id="binIcon" />

        <div className="footer-field">
          <h3>Created by Tony Kovatch</h3>
          <div className="footer-icons">
            <div className="footer-icon">
              <a
                href="https://www.linkedin.com/in/anthony-kovatch-45b674310/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={30} />
              </a>
              <p>LinkedIn</p>
            </div>
            <div className="footer-icon">
              <a
                href="https://github.com/Akovatch"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={30} />
              </a>
              <p>GitHub</p>
            </div>
            <div className="footer-icon">
              <a
                href="mailto:Anthonykovatch@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MdEmail size={30} />
              </a>
              <p>Contact</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
