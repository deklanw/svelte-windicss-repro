<script context="module">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ url, fetch }) {
		const post = await fetch(`${url.pathname}.json`).then((res) => res.json());
		if (!post) {
			return {
				status: 404,
				error: new Error('Post could not be found')
			};
		}

		return {
			props: {
				post
			}
		};
	}
</script>

<script>
	import SEO from '$lib/components/seo.svelte';

	export let post;
</script>

<SEO title={post.title} description={post.description} />

<article class="blogpost">
	<slot />
</article>

<style global>
	.blogpost h1 {
		@apply font-bold;
		@apply text-lg;
		@apply my-4;
	}

	.blogpost h2 {
		@apply font-semibold;
		@apply text-lg;
		@apply my-2;
	}

	.blogpost ul {
		@apply list-disc;
		@apply mx-10;
		@apply my-2;
	}

	.blogpost ol {
		@apply list-decimal;
		@apply mx-10;
		@apply my-2;
	}

	.blogpost blockquote {
		@apply p-4;
		@apply italic;
		@apply border-l-4;
	}
	.blogpost a {
		@apply text-blue-800;
	}

	.blogpost p {
		@apply my-2;
	}
</style>
