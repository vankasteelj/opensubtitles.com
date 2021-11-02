// to run, use `node test.js` 

const apikey = '<FILL ME>'
const username = '<FILL ME>'
const password = '<FILL ME>'

// Load module
const got = require('got')
const os = new (require('./opensubtitles.js'))({apikey: apikey})

// Log-in
os.login({username: username,password: password}).then(response => {
  // search for 'steal this film 2006'
  return os.subtitles({query: 'steal this film 2006'})
}).then(response => {
  // get the download link for the first result
  return os.download({file_id: response.data[0].attributes.files[0].file_id})
}).then(response => {
  console.log('response.body is', response)
}).catch(err => {
  console.log('error message:', err.message)
  console.log('response is:', err.response)
})