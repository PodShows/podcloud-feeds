import Feed from "~/connectors/feed"

const PodcastFields = [
  "_id",
  "title",
  "catchline",
  "description",
  "identifier",
  "language",
  "contact_email",
  "author",
  "explicit",
  "tags",
  "cover_filename",
  "parent_feed",
  "external",
  "block_itunes",
  "block_google_podcasts",
  "itunes_category",
  "disabled",
  "feed_redirect_url",
  "web_redirect_url",
  "created_at",
  "ordering",
  "updated_at",
  "feed_cover",
  "_slugs"
]

const podcasts = function() {
  return new Promise((resolve, reject) => {
    Feed.find(
      {
        draft: { $ne: true },
        disabled: { $ne: true }
      },
      PodcastFields,
      {
        sort: {
          created_at: -1
        },
        limit: 500
      }
    ).exec(function(err, feeds) {
      if (err) {
        reject(err)
      } else {
        resolve(feeds)
      }
    })
  })
}

export default podcasts
