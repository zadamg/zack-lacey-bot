<script>
	import { BarLoader } from 'svelte-loading-spinners';
	import { Circle2 } from 'svelte-loading-spinners';
	import { navigating } from '$app/stores'

    export let loading = false;
	export let durationSeconds = "7s";
	export let size = "200";
	export let class_ = "self-center mx-auto rounded"
	export let loadType = "bar";
</script>



{#if loading}
<div class={class_}>
	{#if loadType == "bar"}
		<BarLoader size="{size}" color="#6966ff" unit="px" duration="{durationSeconds}" />
	{:else if loadType == "circle"}
		<Circle2 size="{size}"  unit="px"  colorOuter="#ec4899" colorCenter="#27b3ca" colorInner="#ededf0"/>
	{:else if loadType == "both"}
		<Circle2 size="{size}"  unit="px"  colorOuter="#ec4899" colorCenter="#27b3ca" colorInner="#ededf0"/>
		<BarLoader size="{size}" color="#6966ff" unit="px" duration="{durationSeconds}" />
	{/if}
</div>
{/if}

