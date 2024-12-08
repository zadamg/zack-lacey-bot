<!-- src\routes\page.svelte -->
<script lang="ts">
    let responseContent: any = null;
    let loading = false;
    let errorMessage = '';

    async function callLambda() {
        loading = true;
        errorMessage = '';
        const method = 'search_and_crawl';
        const additionalData = {
            user: 'MyApp',
            queries: ['"advertising production resources"', 'https://www.aprco.com'],
            content_package_id: 'DeCoNsTrUcToR',
            topic: '🖖',
            days_back: 3650,
            intents: [],
            ignore_under_slashes: 3,
            types: [],
            save_only_top_n: 2
        };

        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ method, additionalData })
            });

            if (response.ok) {
                responseContent = await response.json();
            } else {
                errorMessage = 'Error calling API';
            }
        } catch (error) {
            errorMessage = error.message || 'An error occurred';
        } finally {
            loading = false;
        }
    }
</script>

{#if loading}
    <p>Loading...</p>
{:else}
    <button on:click={callLambda}>Invoke Lambda</button>
    {#if responseContent}
        <pre>{JSON.stringify(responseContent, null, 2)}</pre>
    {/if}
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
{/if}
