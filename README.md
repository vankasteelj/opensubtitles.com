# Opensubtitles.com NodeJS API wrapper

A simple nodejs wrapper for the [Opensubtitles.com](https://www.opensubtitles.com/) REST API. *Read https://opensubtitles.stoplight.io/docs/opensubtitles-api/*

## Example usage
### Setup
`npm install opensubtitles.com`

### Initialize
```js
const OS = require('opensubtitles.com')
const os = new OS({apikey: '<YOUR API KEY'>})
``` 

### Login
```js
os.login({
  username: '<USERNAME>',
  password: '<PASSWORD>'
}).then((response) => {
  /* response {
    token: '<YOUR BEARER TOKEN>',
    user: { <USER PROFILE DETAIL > },
    status: 200
  }*/ 
}).catch(console.error)
```

*Alternatively, you can use the `os.user.login()` call, store the token yourself and pass it as an argument with every call requiring user authentication*

### Search for a subtitle
```js
os.subtitle({
  query: 'Steal this film 2006',
}).then((response) => {
  /* response {
    total_pages: 1,
    total_count: 13,
    page: 1,
    data: <SUBTITLES LIST>
  } */
}).catch(console.error)
```

### Download a subtitle
```js
os.download({
  file_id: '2800'
}).then((response) => {
  /* response {
    link: <URL TO THE REQUESTED FILE>
  }*/
}).catch(console.error)
```

## License
The MIT License (MIT) - author: Jean van Kasteel vankasteelj@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.