export interface SiteSocialLinks {
  github: string;
  linkedin: string;
  medium: string;
}

export interface SiteContact {
  email: string;
  emailMailto: string;
  whatsappNumber: string;
  whatsappUrl: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  contact: SiteContact;
  socials: SiteSocialLinks;
}

export const siteConfig: SiteConfig = {
  name: "Nihad Nilabdeen",
  title: "Nihadh — Software Engineer & Systems Architect",
  description:
    "Portfolio of Nihad Nilabdeen, 3rd-year Software Engineering Undergraduate at UoK, Sri Lanka. Specializing in Systems Architecture, Full-Stack Engineering, and AI.",
  url: "https://nihadh.dev",
  contact: {
    email: "nihath854@gmail.com",
    emailMailto: "mailto:nihath854@gmail.com",
    whatsappNumber: "07684303555",
    whatsappUrl: "https://wa.me/947684303555",
  },
  socials: {
    github: "https://github.com/Nihadhiyan",
    linkedin: "https://linkedin.com/in/Nihadhiyan",
    medium: "https://medium.com/@Nihadhiyan",
  },
};
