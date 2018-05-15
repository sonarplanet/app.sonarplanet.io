# Sonar Planet

## Install
```
yarn
```

## Build
Generates files in dist repository

### Development (localhost) mode
```
yarn dev
```
Deployment url: http://localhost:3000


### Integration mode
```
yarn integ
```

### Production mode
```
yarn prod
```

### Tests
```
yarn test
```

### Pseudo Unique ID
A pseudo-unique 42 character length id is generated and stored in session storage to associate browser and every created notification (```sonarplanet_unique_id```)

## Contribute

### Prettify 

Manually run `yarn prettify`

*OR* configure your editor with this [doc](https://prettier.io/docs/en/editors.html#visual-studio-code)

### Linter

run `yarn lint`

Rules are defined into these [projects](https://github.com/blakeembrey/tslint-config-standard#rules)
