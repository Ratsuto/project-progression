import {createRouter, createWebHistory} from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import ProjectTable from "@/views/ProjectTable.vue";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";


const routes = [
    {path: '/', redirect: '/Login'},
    {path: '/Login', name: 'Login', component: Login},
    {
        path: '/Home', name: 'Home', component: Home,
        children: [
            {path: '', name: 'Dashboard', component: Dashboard},
            {path: '/UpdateProject', name: 'UpdateProject', component: ProjectTable}
        ],
        meta: {requiresAuth: true} // protect this group
    },
]


const router = createRouter({
    history: createWebHistory('/progression/'), routes
})

//Route Guard to prevent direct access without login
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.meta.requiresAuth && !token) {
        next('/')
    } else {
        next()
    }
});

export default router