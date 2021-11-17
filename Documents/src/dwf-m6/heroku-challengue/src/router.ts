import { Router } from '@vaadin/router';

const router = new Router(document.querySelector('.root'));
router.setRoutes([
    { path: '/', component: 'sign-up' },
    { path: '/signup', component: 'sign-up' },
    { path: '/home', component: 'home-page' },
    { path: '/chat', component: 'chat-page' }
]);