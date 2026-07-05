"use client";

import { HorizontalProjectVault } from "./HorizontalProjectVault";

export interface DossierProject {
  id: string;
  index: string;
  title: string;
  status: string;
  description: string;
  tags: string[];
  image?: string;
  href?: string;
}

export function ProjectDossier() {
  return <HorizontalProjectVault />;
}
