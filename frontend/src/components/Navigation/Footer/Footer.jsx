import React from "react";
import "./Footer.css";

export default function Footer() {
	return (
		<footer className="app-footer" role="contentinfo">
			{/* 4 círculos en las esquinas */}
			<div className="footer-corner-circle top-left"></div>
			<div className="footer-corner-circle top-right"></div>
			<div className="footer-corner-circle bottom-left"></div>
			<div className="footer-corner-circle bottom-right"></div>
			
			<div className="footer-inner">
				<div className="footer-left">
					<p className="footer-tagline">Donde el arte encuentra su público y los creadores encuentran su oportunidad.</p>

					<div className="footer-contacts">
						<a href="mailto:echo.info.contact@gmail.com">echo.info.contact@gmail.com</a>
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
						<a href="https://www.instagram.com/echo.info.contact/" target="_blank" rel="noreferrer" aria-label="Instagram (se abre en nueva pestaña)">Instagram</a>
						<a href="https://www.linkedin.com/in/echo-info-9b6a0b40a/" target="_blank" rel="noreferrer" aria-label="LinkedIn (se abre en nueva pestaña)">LinkedIn</a>
						<a href="https://x.com/ECHOInfo_" target="_blank" rel="noreferrer" aria-label="Twitter (se abre en nueva pestaña)">Twitter</a>
					</div>
				</div>
			</div>
			<div className="footer-watermark">ECHO</div>
		</footer>
	);
}
