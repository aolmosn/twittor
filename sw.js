// imports
importScripts('js/sw-utils.js');

const STATIC_CHACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CHACHE = 'inmutable-v1';

const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.ico',
    'img/avatars/ironman.ico',
    'img/avatars/spiderman.ico',
    'img/avatars/thor.ico',
    'img/avatars/wolverine.ico',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'css/animate.css',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'js/libs/jquery.js'
]

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CHACHE)
                        .then( cache => cache.addAll( APP_SHELL ))
    const cacheInmutable = caches.open(INMUTABLE_CHACHE)
                        .then( cache => cache.addAll( APP_SHELL_INMUTABLE ))

    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]) );

})

self.addEventListener('activate', (e => {

    const  response = caches.keys().then( keys => {
        keys.forEach( key => {
            if( key !== CACHE_STATIC_NAME && key.includes('static')){
                return caches.delete(key);
            }
        })
    })
    e.waitUntil( response );
}));

self.addEventListener('fetch', e => {

    const respuesta = caches.match( e.request ).then( res => {
        if ( res ) {
            return res;
        } else {
            console.log(e.request.url)
            return fetch( e.requst ).then ( res => {
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, res);
            })
        }
    });
    
    e.respondWith( respuesta );
})