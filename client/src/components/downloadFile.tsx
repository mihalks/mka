// Copyright (c) 2021 Ivan Teplov

/**
 * Function used to download a file
 */
export function downloadFile(url: string, filename: string) {
  // Create an <a> tag
  const link = document.createElement('a')
  // 'download' attribute is used to set the name of a file to download
  link.download = filename
  // Link to a file
  link.href = url
  // Simulate clicking on the link
  link.click()
}

export default downloadFile
