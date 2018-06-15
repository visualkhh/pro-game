# START
- npm install
- tsc index.ts --watch

#dist
- tsc   하면 dist로 js빠진다.
- tsc -W

# --------------SETTING-------

- 출처 : http://mobicon.tistory.com/499
- 출처 : https://novemberde.github.io/node/2017/10/22/Express-Typescript.html
- https://medium.com/factory-mind/websocket-node-js-express-step-by-step-using-typescript-725114ad5fe4
npm init -y


#필요한 패키지를 설치한다.

- npm i -g typescript@latest
- npm i -g ts-node
- npm i @types/node --save-dev

#Typescript 환경파일을 생성한다.
- https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
- $ tsc --init


# 테스트를 위해 소스 변경을 런타임시에 체크하고 적용하는 nodemone을 설치한다. 
- $ npm i nodemon --save-dev



# 또는 ts-node를 설치해서 수행해도 된다.
- $ npm install --save ts-node

npm i typescript tslint                                                                                   
tslint --init

# core-js
- npm install @types/core-js

#linus nodejs install
- https://nodejs.org/ko/download/package-manager/
- sudo yum install nodejs npm

#tsc
- https://poiemaweb.com/typescript-introduction

#Grunt   XXXXXXXX
타입스크립트를 컴파일하기위해 우리는 Grunt task runner 를 사용할 것입니다. 

npm 을 사용하여 다시 grunt 관련하여 여러가지를 인스톨 해보죠. 그리고 gruntfile.js 파일을 만들 것 입니다. 

Bash
$ npm install grunt --save
$ npm install grunt-cli --save
$ npm install grunt-ts --save
$ npm install grunt-tslint --save
$ npm install grunt-contrib-watch --save
$ npm install tslint --save
$ touch gruntfile.js

- npx: global로 패키지를 설치하지 않더라도 프로젝트 내에서 사용할 수 있게 해준다.
- nodemon: 파일이 변화될 때마다 재실행해준다.
- typescript: typescript로 구성한 코드를 javascript로 트랜스파일링 해준다.
- npm-run-all: 여러 npm 실행 명령을 병렬로 실행할 수 있게 해준다.
- webpack: 요즘 각광받는 모듈 번들러
- source-map-support: typescript로 개발시 source-map을 지원해준다.
- @types/express: express 모듈에 대한 type을 지원해준다.
$ npm install -g npx
$ npm install --save-dev typescript ts-loader npm-run-all webpack @types/express nodemon
$ npm install --save express source-map-support
