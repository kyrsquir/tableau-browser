# Tableau browser

## Install dependencies
```
yarn install
```

## Serve
```
yarn serve
```

## Providing credentials
Create `.env.local` file with the following variables:
```
VUE_APP_TABLEAU_SERVER=
VUE_APP_TABLEAU_SITE=
```
Optional:
```
VUE_APP_TABLEAU_USER=
VUE_APP_TABLEAU_PASSWORD=
```

## Overcoming CORS
A simple proxy server forwards request to Tableau.

### Run proxy server
```
yarn proxy
```