const form = document.getElementById("qform")
const text = document.getElementById("q")
const container = document.getElementById("tweets-container")

async function search (e) {
  e.preventDefault()
  const q = text.value
  const response = await fetch(`/tweets?q=${encodeURI(q)}`)
  const tweets = await response.json()
  const items = tweets.map(
    item => `<li>${item.text}</li>`)
  const html = "<ol>" + items.join() + "</ol>"
  container.innerHTML = html

}
form.onsubmit = search
