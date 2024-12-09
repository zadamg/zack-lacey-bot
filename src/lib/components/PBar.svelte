<script lang="ts">
    import Loading from "$lib/components/Loading.svelte";
    import { afterUpdate } from 'svelte';
    import { modalStore } from '@skeletonlabs/skeleton'; // New import

    export let inputPlaceholder: string = 'ie. "Rewrite this section with more detail."';
    export let loading: boolean = false;
    export let userInput: string = "";

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        event.stopPropagation();
        // Check if there's a modal meta.onSubmit callback
        const currentModal = $modalStore[0]; 
        if (currentModal?.meta?.onSubmit && typeof currentModal.meta.onSubmit === 'function') {
            currentModal.meta.onSubmit(userInput);
        } else {
            // If no callback, fallback (do nothing or log)
            console.log('No onSubmit callback found. userInput:', userInput);
        }
    }

    let intervalIds: number[] = [];
    afterUpdate(() => {
        // Clear existing intervals
        intervalIds.forEach(id => clearInterval(id));
        intervalIds = [];

        let index = 0,
            interval = 1000;
        const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        const animate = (star: HTMLElement) => {
            star.style.setProperty('--star-left', `${rand(2, 90)}%`);
            star.style.setProperty('--star-top', `${rand(2, 90)}%`);
            star.style.animation = 'none';
            star.offsetHeight;
            star.style.animation = '';
        };

        for (const star of document.getElementsByClassName('magic-star')) {
            // Use timeoutId and intervalId to keep track of the timers
            const timeoutId = setTimeout(() => {
                animate(star as HTMLElement);

                const intervalId = setInterval(() => {
                    animate(star as HTMLElement);
                }, interval);
                
                intervalIds.push(intervalId as unknown as number); // Store the interval ID

            }, index++ * (interval / 3));

            intervalIds.push(timeoutId as unknown as number); // Store the timeout ID as well
        }
    });
    function autoGrowTextArea(event: Event) {
        const target = event.target as HTMLTextAreaElement;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
    }

</script>

<div on:click|preventDefault|stopPropagation={() => {}} class="mx-auto w-full min-h-12 mt-2  z-10 flex  max-w-3xl items-center justify-center gap-2 divide-x divide-zinc-600 rounded-3xl bg-zinc-900 px-3 shadow-lg shadow-black/40">
    <div class="flex items-center justify-center rounded-l-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="30px" height="30px" viewBox="0 0 32 32">
            <title/>
            <g data-name="Layer 2" id="Layer_2">
                <path fill="rgb(var(--color-primary-700))" d="M18,11a1,1,0,0,1-1,1,5,5,0,0,0-5,5,1,1,0,0,1-2,0,5,5,0,0,0-5-5,1,1,0,0,1,0-2,5,5,0,0,0,5-5,1,1,0,0,1,2,0,5,5,0,0,0,5,5A1,1,0,0,1,18,11Z"/>
                <path fill="rgb(var(--color-secondary-400))" d="M19,24a1,1,0,0,1-1,1,2,2,0,0,0-2,2,1,1,0,0,1-2,0,2,2,0,0,0-2-2,1,1,0,0,1,0-2,2,2,0,0,0,2-2,1,1,0,0,1,2,0,2,2,0,0,0,2,2A1,1,0,0,1,19,24Z"/>
                <path fill="rgb(var(--color-primary-300))" d="M28,17a1,1,0,0,1-1,1,4,4,0,0,0-4,4,1,1,0,0,1-2,0,4,4,0,0,0-4-4,1,1,0,0,1,0-2,4,4,0,0,0,4-4,1,1,0,0,1,2,0,4,4,0,0,0,4,4A1,1,0,0,1,28,17Z"/>
            </g>
        </svg>
    </div>

    <div class="flex min-w-0 flex-1 items-center self-end relative" on:click|preventDefault|stopPropagation={() => {}}>
        <form method="POST" action="?/handleWholeForm" class="w-full"  on:submit|preventDefault|stopPropagation={handleSubmit}>
            <div class="relative flex h-fit min-h-full w-full items-center transition-all duration-300">
                <label for="textarea-input" class="sr-only">Prompt</label>
                <div class="relative flex min-w-0 flex-1 self-start magic-text2">
                    <textarea
                        id="home-prompt"
                        name="textareainput"
                        bind:value={userInput}
                        required
                        maxlength="2000"
                        style="font-family: Outfit; overflow-y: auto;"
                        class="min-w-[50%] max-h-[200px] magic-text2 flex-[1_0_50%] resize-none border-0 bg-transparent py-3 pl-3 text-sm text-white shadow-none outline-none ring-0 [scroll-padding-block:0.75rem] selection:bg-teal-300 selection:text-black placeholder:text-zinc-500 disabled:bg-transparent disabled:opacity-80 sm:min-h-[15px] sm:leading-6 md:text-md"
                        spellcheck="false"
                        placeholder={inputPlaceholder}
                        on:click|stopPropagation
                        on:focus|stopPropagation
                        on:mouseup|stopPropagation|preventDefault
                    ></textarea>
                </div>
                {#if loading}
                    <div class="flex justify-center flex-col w-fit  align-middle rounded p-0 m-1">
                        <Loading size={"15"} loadType={"circle"}  loading={true} durationSeconds={"10s"} class_="self-end h-fit rounded" />
                    </div>
                {:else}
                    {#if userInput.length > 0}
                        <h1 class=" " style="padding: 0px">
                            <span class="magic title">
                                <span class="magic-star magic-star-1">
                                    <svg viewBox="0 0 512 512">
                                        <path
                                            fill="#FFF"
                                            d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z"
                                        />
                                    </svg>
                                </span>
                                <span class="magic-star title  magic-star-2">
                                    <svg viewBox="0 0 512 512">
                                        <path
                                            fill="#FFF"
                                            d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z"
                                        />
                                    </svg>
                                </span>
                                <span class="magic-star title  magic-star-3">
                                    <svg viewBox="0 0 512 512">
                                        <path
                                            fill="#FFF"
                                            d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z"
                                        />
                                    </svg>
                                </span>
                                <button
                                    type="submit"
                                    on:click|preventDefault|stopPropagation={() => {}}
                                    class="z-25 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-50 opacity-100 outline-none transition-colors hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-outline-token"><span class="sr-only">Send</span>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M13.5 3V2.25H15V3V10C15 10.5523 14.5522 11 14 11H3.56062L5.53029 12.9697L6.06062 13.5L4.99996 14.5607L4.46963 14.0303L1.39641 10.9571C1.00588 10.5666 1.00588 9.93342 1.39641 9.54289L4.46963 6.46967L4.99996 5.93934L6.06062 7L5.53029 7.53033L3.56062 9.5H13.5V3Z"
                                            fill="currentColor"/>
                                    </svg>
                                </button>
                            </span>
                        </h1>
                    {:else}
                        <button
                            type="submit"
                            on:click|preventDefault={() => {
                                new Promise((resolve, reject) => {
                                    modalStore.trigger(registrationModal);
                                })
                            }}
                            class="z-50 ml-1 active:bg-zinc-700 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-50 opacity-100 outline-none transition-colors hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-outline-token"><span class="sr-only">Send</span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M13.5 3V2.25H15V3V10C15 10.5523 14.5522 11 14 11H3.56062L5.53029 12.9697L6.06062 13.5L4.99996 14.5607L4.46963 14.0303L1.39641 10.9571C1.00588 10.5666 1.00588 9.93342 1.39641 9.54289L4.46963 6.46967L4.99996 5.93934L6.06062 7L5.53029 7.53033L3.56062 9.5H13.5V3Z"
                                    fill="currentColor"/>
                            </svg>
                        </button>
                    {/if}
                {/if}
            </div>
        </form>
    </div>
</div>
<div class="flex flex-row w-fit max-w-md">
    <p class="text-xs md:text-sm text-center mt-3  whitespace-pre-wrap w-10/12  mx-auto"><span class="font-black">HINT:</span> Use this prompt to fine-tune the portion you highlighted or click a pre-made action.</p>
</div>