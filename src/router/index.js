import {createRouter, createWebHistory} from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import ProjectTable from "@/views/ProjectTable.vue";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import PageNotFound from "@/views/PageNotFound.vue";
import Operators from "@/views/Operators.vue";
import TaskManagement from "@/views/TaskManagement.vue";
import TaskAssign from "@/components/TaskAssign.vue";
import TaskReport from "@/components/TaskReport.vue";

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', name: 'Login', component: Login},
    {
        path: '/home', name: 'Home', component: Home,
        children: [
            {path: '', name: 'Dashboard', component: Dashboard},
            {path: '/update-progress', name: 'ProjectTable', component: ProjectTable},
            {path: '/operator', name: 'Operators', component: Operators},
            {
                path: '/task-management', name: 'TaskManagement', component: TaskManagement,
                children: [
                    {path: '/assign-task', name: 'TaskAssign', component: TaskAssign},
                    {path: '/report', name: 'TaskReport', component: TaskReport},
                ]
            },
        ],
        meta: {requiresAuth: true} // protect this group
    },

    // Catch-all route (must be last)
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound},
]

const router = createRouter({
    history: createWebHistory('/progression/'), routes
    /*history: createWebHashHistory('/progression/'), routes*/
});

//Route Guard to prevent direct access without login
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth && !token) {
        next('/')
    } else {
        next()
    }
});

export default router