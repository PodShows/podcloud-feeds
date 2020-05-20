import Podcast from "./podcast"

const Cover = {
  url(cover, args, ctx) {
    return `https://${ctx.hosts.uploads}/${
      typeof cover.sha1 === "string" && cover.sha1.trim().length > 0
        ? `uploads/covers/${cover.sha1.match(/([\w]{4})/g).join("/")}/${
            cover.sha1
          }.jpg`
        : `images/nocover.jpg`
    }`
  }
}

export default Cover
