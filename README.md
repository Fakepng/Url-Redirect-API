# Url Redirect API

> This is a simple API to redirect to a url.

## How to use link

Type `https://short.fakepng.com/[nameOfTheLink]`

## How to create a url redirect

Sent GET request to `https://short.fakepng.com/create?name=[nameOfTheLink]&link=[urlToRedirect]&time=[optional]&password=[password]`

```
__Y__M__W__D__h__m__s

Y for years [0-XXXX]
M for months [0-11]
W for weeks [1-4]
D for days [1-31]
h for hours [0-23]
m for minutes [0-59]
s for seconds [0-59]

Every parameter is optional.
If you don't specify a parameter, link will not expire.
```

## How to remove a url redirect

Sent GET request to `https://short.fakepng.com/remove?name=[nameOfTheLink]&password=[password]`

## How to list all url redirects

Sent GET request to `https://short.fakepng.com/list?password=[password]`
