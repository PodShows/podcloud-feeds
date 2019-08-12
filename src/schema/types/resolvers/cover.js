import Podcast from "./podcast"

const Cover = {
  url(cover, args, ctx) {
    let url = `${Podcast._host(cover.feed, args, ctx)}`

    if (cover.item) {
      url += "/" + cover.item._slugs[cover.item._slugs.length - 1]
    }

    url += `/cover.${cover.sha1}.jpg`

    if (!/^https?:\/\//i.test(url)) url = "http://" + url

    return url
  }
}

export default Cover
