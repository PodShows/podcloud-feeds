import Podcast from "./podcast"

const build_url = (ctx, cover, size) => {
  const host = ctx.hosts.uploads
  const sha1 = cover.sha1
  const external = (cover.item || cover.feed).external

  let size_prefix = `${size || ""}`.trim()
  if (size_prefix.length > 0) {
    size_prefix += "_"
  }

  let url = `https://${host}/`

  if (typeof sha1 === "string" && sha1.trim().length > 0) {
    url += `uploads/covers/`
    url += sha1.match(/([\w]{4})/g).join("/")
    url += `/${size_prefix}${sha1}.jpg`
  } else {
    url += `images/${size_prefix}nocover${external ? "_external" : ""}.jpg`
  }

  return url
}

const Cover = {
  url(cover, args, ctx) {
    return build_url(ctx, cover)
  },
  small_url(cover, args, ctx) {
    return build_url(ctx, cover, "small")
  },
  medium_url(cover, args, ctx) {
    return build_url(ctx, cover, "medium")
  },
  big_url(cover, args, ctx) {
    return build_url(ctx, cover, "big")
  }
}

export default Cover
