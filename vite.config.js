import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	vite: {
		resolve: {
		  alias: {
			$houdini: path.resolve('.', '$houdini'),
		  },
		},
		server: {
		  fs: {
			// Allow serving files from one level up to the project root
			allow: ['..'],
		  },
		},
	  },
};

export default config;