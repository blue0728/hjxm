export default [{
	path: '/',
	name: 'index',
	component: (resolve) => {
		require(['./views/index.vue'], resolve)
	}
}, {
	path: '/edit-password',
	name: 'edit-password',
	component: (resolve) => {
		require(['./views/edit-password.vue'], resolve)
	}
}, {
	path: '/logout',
	name: 'logout',
	component: (resolve) => {
		require(['./views/logout.vue'], resolve)
	}
}, {
	path: '/types',
	name: 'types',
	component: (resolve) => {
		require(['./views/types.vue'], resolve)
	}
}, {
	path: '/post-list',
	name: 'post-list',
	component: (resolve) => {
		require(['./views/post-list.vue'], resolve)
	}
}, {
	path: '/post-detail/:id',
	name: 'post-detail',
	component: (resolve) => {
		require(['./views/post-detail.vue'], resolve)
	}
}, {
	path: '/post-add',
	name: 'post-add',
	component: (resolve) => {
		require(['./views/post-add.vue'], resolve)
	}
}, {
	path: '/member-list',
	name: 'member-list',
	component: (resolve) => {
		require(['./views/member-list.vue'], resolve)
	}
}, {
	path: '/member-detail/:id',
	name: 'member-detail',
	component: (resolve) => {
		require(['./views/member-detail.vue'], resolve)
	}
}, {
	path: '/member-add',
	name: 'member-add',
	component: (resolve) => {
		require(['./views/member-add.vue'], resolve)
	}
}, {
	path: '/ad-list',
	name: 'ad-list',
	component: (resolve) => {
		require(['./views/ad-list.vue'], resolve)
	}
}, {
	path: '/ad-add',
	name: 'ad-add',
	component: (resolve) => {
		require(['./views/ad-add.vue'], resolve)
	}
}, {
	path: '/ad-detail/:id',
	name: 'ad-detail',
	component: (resolve) => {
		require(['./views/ad-detail.vue'], resolve)
	}
}, {
	path: '/page-list',
	name: 'page-list',
	component: (resolve) => {
		require(['./views/page-list.vue'], resolve)
	}
}, {
	path: '/page-detail/:id',
	name: 'page-detail',
	component: (resolve) => {
		require(['./views/page-detail.vue'], resolve)
	}
}, {
	path: '/page-add',
	name: 'page-add',
	component: (resolve) => {
		require(['./views/page-add.vue'], resolve)
	}
}, {
	path: '/message-list',
	name: 'message-list',
	component: (resolve) => {
		require(['./views/message-list.vue'], resolve)
	}
}, {
	path: '/user-list',
	name: 'user-list',
	component: (resolve) => {
		require(['./views/user-list.vue'], resolve)
	}
}, {
	path: '/user-add',
	name: 'user-add',
	component: (resolve) => {
		require(['./views/user-add.vue'], resolve)
	}
}, {
	path: '/pictures',
	name: 'pictures',
	component: (resolve) => {
		require(['./views/pictures.vue'], resolve)
	}
}, {
    path: '/system-log',
    name: 'system-log',
    component: (resolve) => {
        require(['./views/system-log.vue'], resolve)
    }
}];