export function JSONParse(str: string | null) {
  if (str === null) {
    return null
  } else {
    return JSON.parse(str)
  }
}

const title = '益谦服饰'

export default function getPageTitle(pageTitle: string) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

/**
 * Upper case first char
 * @param {String} str
 */
 export function uppercaseFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
