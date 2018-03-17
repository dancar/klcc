const refreshButton = document.getElementById("refreshButton")
const container = document.getElementById("tweets-container")

async function refresh (e) {
  const response = await fetch("/tweets")
  const tweets = await response.json()
  const items = tweets.map(
    item => `<li>${item.text}</li>`)
  const html = "<ol>" + items.join() + "</ol>"
  container.innerHTML = html

}
refreshButton.onclick = refresh
