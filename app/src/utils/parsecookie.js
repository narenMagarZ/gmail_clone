
export function ParseCookie(cookie){
    const parsedCookie = cookie.split('; ')
    const cookies = {}
    if(parsedCookie.length > 0){
      for(let c of parsedCookie ){
        const cookiePair = c.split('=')
        const cookieKey = cookiePair[0]
        const cookieValue = cookiePair[1]
        cookies[cookieKey] = cookieValue
      }
    }
    console.log(cookies)
    return cookies
}