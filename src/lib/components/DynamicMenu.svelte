<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { goto } from '$app/navigation'

    export let menuItems: { [key: string]: any };
    export let textColor: string = ' text-black'

    const dispatch = createEventDispatcher();

    const handleClick = (itemName: string) => {
        dispatch('menuClick', { item: itemName });
    };
    function reloadPage() {
        window.location.reload();
    }
</script>

<div class="menu-container relative flex flex-row flex-wrap gap-4 mr-4 lg:gap-20 !align-bottom h-fit cursor-pointer">
    <a href="/" on:click={reloadPage}>
        <h1 class="text-4xl spinner menu-item " style="font-family: HK Black; font-size: clamp(2.25rem, 4vmax, 5rem) !important; ">/</h1>
    </a>
    {#each Object.keys(menuItems) as item}
        <div class="menu-item textColor align-bottom pt-[1%] sleek-under" style="font-size: clamp(1.25rem, 2vmax, 4rem) !important" on:click={() => handleClick(item)}>
            {item}
        </div>
    {/each}
</div>

<style>
        .sleek-under {
            text-decoration: underline 0.15em rgba(0, 0, 0, 0.1) ;
            text-decoration-thickness: 1px ;
            text-decoration-color: rgba(0, 0, 0, 0.0) ;
            text-underline-offset: 0.08em;
            font-weight: normal;
            transition: text-decoration-color 300ms, text-underline-offset 300ms;
            text-decoration-skip-ink: none;
            --webkit-text-decoration-skip: none;
            transition-timing-function:  cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
    
        .sleek-under:hover {
            text-decoration-color: #d10c0c;
            text-underline-offset: -.22em;
            text-decoration-thickness: 25px;
            font-weight: 200;
            }

    .spinner:hover {
		transform: rotate(720deg);
	}
	.spinner {
		transition: transform 3s cubic-bezier(0.175, 0.985, 0.32, 1.775);
	}
</style>