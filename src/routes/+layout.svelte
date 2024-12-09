<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { Toaster } from 'svelte-french-toast'
    import { Modal, modalStore } from '@skeletonlabs/skeleton';
    import PBar from '../lib/components/PBar.svelte';
    // Initialize your Skeleton stores if needed:
    // (Not shown here, as initialization may differ in your setup)

    // Define the component registry:
    const modalComponentRegistry = {
        followUpModalComponent: {
            ref: PBar
        }
    };
</script>

<Modal components={modalComponentRegistry} />
<Toaster />
<slot />

