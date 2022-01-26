import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { windi } from "svelte-windicss-preprocess";

import katex from 'katex';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import visit from 'unist-util-visit';

// hack around MDSveX's lack of proper support https://github.com/pngwn/mdsvex-math
const correctHastTree = () => (tree) => {
	visit(tree, 'text', (node) => {
		if (node.value.trim().startsWith('<')) {
			node.type = 'raw';
		}
	});
};

const katexBlocks = () => (tree) => {
	visit(tree, 'code', (node) => {
		if (node.lang === 'math') {
			const str = katex.renderToString(node.value, {
				displayMode: true,
				leqno: false,
				fleqn: false,
				throwOnError: true,
				errorColor: '#cc0000',
				strict: 'warn',
				output: 'htmlAndMathml',
				trust: false,
				macros: { '\\f': '#1f(#2)' }
			});

			node.type = 'raw';
			node.value = '{@html `' + str + '`}';
		}
	});
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: [
		windi({}),
		mdsvex({
			extensions: ['.svx', '.md'],
			remarkPlugins: [remarkMath, katexBlocks],
			rehypePlugins: [correctHastTree, rehypeKatex],
		}),
	],
	kit: {
		adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		prerender: {
			onError: 'continue'
		}

	}
};

export default config;