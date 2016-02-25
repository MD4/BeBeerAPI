# BeBeerAPI
## API Reference
### Root
#### get
Returns the informations you are currently seeing.


URL: ```GET /```

### Beer
#### getBeers
Returns a paginated list of beers.


URL: ```GET /beers```
##### URL parameters
###### count
```
type: 'integer'
minimum: 1
maximum: 30
default: 20
```
###### offset
```
type: 'integer'
minimum: 0
default: 0
```
###### name
```
type: 'string'
default: ''
minLength: 1
maxLength: 100
```
#### getBeer
Returns a beer from its id.


URL: ```GET /beers/:id```
##### URL parameters
###### id
```
description: 'the id of the beer'
type: 'string'
pattern: '^[0-9]+$'
required: true
maxLength: 10
```
#### rateBeer
Rate a beer.


URL: ```POST /beers/:id/ratings```
##### URL parameters
###### id
```
description: 'the id of the beer'
type: 'string'
pattern: '^[0-9]+$'
required: true
maxLength: 10
```
##### Request body
###### rating
```
type: 'integer'
minimum: 0
maximum: 5
required: true
```
#### getRatings
Returns the given beer rating.


URL: ```GET /beers/:id/ratings```
##### URL parameters
###### id
```
description: 'the id of the beer'
type: 'string'
pattern: '^[0-9]+$'
required: true
maxLength: 10
```
### Brewery
#### getBreweries
Returns a paginated list of breweries.


URL: ```GET /breweries```
##### URL parameters
###### count
```
type: 'integer'
minimum: 1
maximum: 30
default: 20
```
###### offset
```
type: 'integer'
minimum: 0
default: 0
```
###### name
```
type: 'string'
default: ''
minLength: 1
maxLength: 100
```
#### getBrewery
Returns the brewery corresponding to the given name.


URL: ```GET /breweries/:id```
##### URL parameters
###### id
```
type: 'string'
default: ''
minLength: 1
maxLength: 100
```
#### getBeers
Returns the beers brewed by the given brewery.


URL: ```GET /breweries/:id/beers```
##### URL parameters
###### id
```
type: 'string'
default: ''
minLength: 1
maxLength: 100
```
### User
#### createUser
Creates an user with the given data.


URL: ```POST /users```
##### Request body
###### username
```
type: 'string'
default: ''
format: /^[a-z0-9\-_]+$/
minLength: 3
maxLength: 50
required: true
```
###### email
```
type: 'string'
format: 'email'
default: ''
required: true
```
###### password
```
type: 'string'
default: ''
minLength: 6
maxLength: 50
required: true
```
#### getUser
Returns the user with the given username.


URL: ```GET /users/:id```
##### URL parameters
###### id
```
type: 'string'
default: ''
format: /^[a-z0-9\-_]+$/
minLength: 3
maxLength: 50
required: true
```
### Auth
#### auth
Authenticates the user with the given credentials.


URL: ```POST /auth```
##### Request body
###### username
```
type: 'string'
default: ''
format: /^[a-z0-9\-_]+$/
minLength: 3
maxLength: 50
required: true
```
###### password
```
type: 'string'
default: ''
minLength: 6
maxLength: 50
required: true
```
#### getAuth
Returns the current authentication.


URL: ```GET /auth```

#### deleteAuth
Deauthenticates the user.


URL: ```DEL /auth```
