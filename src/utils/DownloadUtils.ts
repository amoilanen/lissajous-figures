export function downloadUrl(url: string, title: string): void {
  const downloadLink = document.createElement('a')
  downloadLink.setAttribute('download', title)
  downloadLink.setAttribute('href', url)
  downloadLink.click()
}