import React from "react";
import "./Footer.css";

export default function Footer() {
	return (
		<footer className="app-footer" role="contentinfo">
				{/* svg de la ola */}
				<div className="footer-wave" aria-hidden="true">
					<svg viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0,160 C200,80 400,40 720,70 C1040,100 1200,140 1440,90 L1440,220 L0,220 Z" fill="var(--black)" />
					</svg>
				</div>
				
				<div className="footer-inner">
				<div className="footer-left">
					<p className="footer-tagline">Donde el arte encuentra su público y los creadores encuentran su oportunidad.</p>

					<div className="footer-contacts">
						<span>hello@echo.com</span>
						<span className="dot">·</span>
						<span>(34) 900334455</span>
					</div>

					<div className="footer-bottom-left">
						<span>© {new Date().getFullYear()} ECHO. Todos los derechos reservados.</span>
					</div>
				</div>

				<div className="footer-right">
					<div className="footer-links-small">
						<a href="/privacy">Política de privacidad</a>
						<span className="dot">·</span>
						<a href="/terms">Términos</a>
						<span className="dot">·</span>
						<a href="/cookies">Cookies</a>
					</div>

					<div className="footer-socials">
						<a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
						<a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
						<a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
					</div>
				</div>
			</div>
			<div className="footer-watermark">ECHO</div>
		</footer>
	);
}

