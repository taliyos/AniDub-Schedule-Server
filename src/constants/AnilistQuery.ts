export const query = `
query fetchShow ($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
        }
        media (search: $search, type: ANIME, sort: TITLE_ROMAJI) {
            title {
                romaji
                english
            }
            id
            episodes
            coverImage {
                extraLarge
            }
            externalLinks {
                site,
                url
            }
            status
        }
    }
}
`;