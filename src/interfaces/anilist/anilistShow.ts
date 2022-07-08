export interface AnilistShow {
    id: number,
    coverImage: string,
    externalLinks: ExternalLink[]
}

export interface ExternalLink {
    site: string;
    url: string;
}