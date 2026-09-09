import { createFileRoute } from "@tanstack/react-router";
import LabsContactPage from "@/components/LabsContactPage";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us - 3D HUB" },
      { name: "description", content: "Get in touch with 3D HUB." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Plus+Jakarta+Sans:wght@200;300;400;500;600&display=swap",
      },
    ],
  }),
  component: ContactUs,
});

function ContactUs() {
  return <LabsContactPage activePage="contact-us" />;
}
