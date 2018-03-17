const text = document.getElementById("q")
const countLabel = document.getElementById("count")
const container = document.getElementById("tweets-container")

async function search (e) {
  const q = text.value
  const response = await fetch(`/tweets?q=${encodeURI(q)}`)
  const tweets = await response.json()
  const items = tweets.map(
    item => `<li><i>${item.metadata.handle}, ${new Date(item.metadata.createdAt).toUTCString()}</i><br/>${item.text}</li>`)
  const html = "<ol>" + items.join() + "</ol>"
  container.innerHTML = html
  countLabel.innerHTML = `(${tweets.length})`

}
text.oninput = search
