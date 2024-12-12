<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'
  import DynamicMenu from '$lib/components/DynamicMenu.svelte';
  import Typewriter from 'svelte-typewriter'
	import type { PageData } from './$types'
  import { relationshipDetails } from '$lib/relationshipDetails'
	import Fire from '$lib/components/Fire.svelte';
  import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
  import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
  
	export let data: PageData
  let inputElement;

  function handleFocus() {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
  }

  function combinedFocus() {
    handleFocus();
    handleMouseOver2();
  }

	$: console.log(data)

  let backgroundColor = "white";
  let foregroundColor = "black";
  let message = 'Let\'s take stuff apart...';

  interface ChatMessage {
      role: 'user' | 'system' | 'assistant';
      content: string;
  }

  let conversation: ChatMessage[] = [];

  function makeDropCap(text: string) {
    // takes a string, removes the first letter, and wraps it in a span with a class of dropcap, returns both the first letter and the rest of the string
    let firstLetter = text.slice(0, 1);
    let restOfText = text.slice(1);
    return {
      dropcap: firstLetter, 
      restOfText: restOfText
    };
  }

  // on mobile, the input raises the keyboard, which shifts the page up, so we need to scroll back to the top
  

  async function handleHigherOracleClick(newPrompt: string) {
      handleFocus();
      loading = true;
      message = '';
      handleMouseOver2();
      const formContainer = document.getElementById('form-container');
      if (formContainer) formContainer.style.display = 'none';

      let messagesToSend: ChatMessage[] = [
          { role: 'system', content: `You are a neutral, no-bullshit, straight-shooting relationship messenger and comminucator who uses specific examples, dates, and so on to answer questions concisely...` }
      ];
      for (const c of conversation) {
          messagesToSend.push(c);
      }

      const userPrompt = `The user is asking about the relationship between Zack & Lacey: "${queryInput}". Provide an honest, empathetic, and balanced response. Consider both perspectives and avoid taking sides. The tone should be kind, understanding, and supportive but also direct and straight to the point.  Keep it to 4 sentences max. Do not mention that you are an AI or break character and do not begin with a quotation mark for parsing purposes. NEVER mention disorders like NPD or BPD because this can be triggering, even if it looks like it's present in the details. DO NOT BE WORDY! Talk like you're conversing and be straight to the point, use specific details/specifics, and don't be too descriptive.. again, we want concise, to-the-point answers here that use specifics and precise details. DO NOT BE VAGUE!!!!  Here is a bunch of information about Zack & Lacey's relationship: \n\n ${relationshipDetails} \n\n Make sure to only answer what's asked. For example, if the question is something simple like, "What date did this happen?" then just answer that question; DON'T add more than necessary! If the question is more complex, then you can provide a more detailed response. In all responses, please be specific (I've said this multiple times so it's important); give specific examples for complex or nuanced questions. Keep in mind that the person asking the question is a 3rd party, not lacey or zack themselves. Also, don't sugar coat anything and you can use foul fucking language - don't be scared, especially if the input has foul language and you need to repeat it to answer the question. Be conversational in a direct and precise way. Remember to give an exmample or two! If you're able to reference specific dates or events or , that would be great. If you can't, that's okay too. Just be as specific as you can. If you don't know the answer to a question, don't make it up, just say you don't know.  If the user is asking some general question like, "wtf is this?" or something, you can explain very briefly that this is a tool and that you are a relationship communicator designed to explainthe nuance, etc. But only if it's necessary; ie. the question is vague.`; 

      messagesToSend.push({ role: 'user', content: userPrompt });

      try {
          const res = await fetch('/api/openai', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messages: messagesToSend })
          });

          if (!res.ok) {
              throw new Error('Failed to fetch from OpenAI API');
          }

          const data = await res.json();
          responseContent = data.choices[0]?.message?.content || 'No response';
          responseDropCap = makeDropCap(responseContent).dropcap;
          responseContent = makeDropCap(responseContent).restOfText;
          backgroundColor = "black";
          foregroundColor = "white";
          message = responseContent;

          conversation.push({ role: 'user', content: newPrompt });
          conversation.push({ role: 'assistant', content: responseDropCap + responseContent });
      } catch (error) {
          console.log('Error:', error);
          responseContent = '😡 Error fetching response';
      } finally {
          loading = false;
      }
  }

  async function handleDeconstructClick() {
      await handleHigherOracleClick(queryInput);

      // const additionalData = {
      //     user: 'LACEYZACKBOT',
      //     queries: [''],
      //     content_package_id: 'DeCoNsTrUcToR',
      //     topic: '💩',
      //     days_back: 3650,
      //     intents: [],
      //     ignore_under_slashes: 3,
      //     types: [],
      //     save_only_top_n: 2
      // };
      // console.log('Calling Lambda with: ', additionalData);

      // const response = await fetch('/api', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //         method: 'search_and_crawl',
      //         additionalData
      //     })
      // });

      // if (response.ok) {
      //     const responseData = await response.json();
      //     console.log(responseData);
      // } else {
      //     console.error('Error calling API');
      // }
  }
  const chatChoiceModal: ModalSettings = {
    type: 'confirm',
    title: 'Continue or Start Over?',
    body: 'You already have a conversation going. Continue or start a new chat?',
    response: (confirmed: boolean) => {
        if (confirmed) {
            // The user clicked the "OK" (confirm) button
            const followUpModal: ModalSettings = {
                type: 'component',
                component: 'followUpModalComponent',
                meta: {
                    onSubmit: async (userPrompt: string) => {
                        await handleHigherOracleClick(userPrompt);
                        modalStore.close(); // close the follow-up modal
                    }
                }
            };
            modalStore.trigger(followUpModal);
        } else {
            // The user clicked the "Cancel" button
            location.reload();
        }
    }
};


	function handleMouseOver(e: MouseEvent | FocusEvent) {
    wavy = true
    if (responseContent !== '') {
      return
    }
		// set backgroundColor to black and foregroundColor to white
		backgroundColor = "black";
		foregroundColor = "white";
		// set css variable --cursor-color to white
		document.documentElement.style.setProperty("--cursor-color", "white");
	}

  // make a function to just set the mouse over settings without any event
  function handleMouseOver2() {
    if (responseContent !== '') {
      return
    }
    // set backgroundColor to black and foregroundColor to white
    backgroundColor = "black";
    foregroundColor = "white";
  }

	function handleMouseOut(e: MouseEvent | FocusEvent) {
    wavy = false
    if (responseContent !== '') {
      return
    }
		// set backgroundColor to white and foregroundColor to black
		backgroundColor = "white";
		foregroundColor = "black";
		// set css variable --cursor-color to black
		document.documentElement.style.setProperty("--cursor-color", "black");
	}

  // make a function to just set the mouse out settings without any event
  function handleMouseOut2() {
    if (responseContent !== '') {
      return
    }
    // set backgroundColor to white and foregroundColor to black
    backgroundColor = "white";
    foregroundColor = "black";
  }

	// displacement turbs
	let numOctaves = 5
	let wavy = false
	function makeWavy(node: HTMLElement) {
		function enter() {
			wavy = true
		}
		function leave() {
			wavy = false
		}
		node.addEventListener('mouseenter', enter)
		node.addEventListener('mouseleave', leave)
		return {
			destroy() {
				node.removeEventListener('mouseenter', enter)
				node.removeEventListener('mouseleave', leave)
			}
		}
	}
  
	///////

  let queryInput = ''; // To store the user input
  let responseContent = ``;
  let responseDropCap = 'z';
  let loading = false;


  ///////
  let gradientStyle = 'linear-gradient(to bottom, black 50%, transparent)';
  // Reactive statement to adjust gradient based on content size
  $: if (typieElement) {
    const elementHeight = typieElement.clientHeight;

    // Adjust gradient dynamically
    gradientStyle = elementHeight > 300 
      ? 'linear-gradient(to bottom, black 10%, transparent)' 
      : 'linear-gradient(to bottom, black 50%, transparent)';
  }
  let menuItems: { [key: string]: any } = {
        "Value": "Home content...",
        "Meta": "Home content...",
        "People": "Home content...",
        "Story": "Home content...",
        "Archetypes": "About content...",
        "Semiotics": "Contact content..."
        // ... more items
    };

    let selectedContent = "Home";
    let typieElement: HTMLElement;

    const handleMenuClick = (event: CustomEvent) => {
        selectedContent = menuItems[event.detail.item];
    };
    let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>
<div  class="biggie fixed w-full h-auto overflow-auto !bg-{backgroundColor}" style="background: {backgroundColor} !important">
	<div  id="boxie" style="border: clamp(1rem, 1.5vw, 65rem) solid {foregroundColor}"on:focus={handleMouseOver}
  on:blur={handleMouseOut}
  on:pointerenter={handleMouseOver} 
  on:pointerleave={handleMouseOut}>
          <!-- Paragraph shown above input when no response yet -->
          {#if responseContent === ''}
          <p class="m-4 text-{foregroundColor}" style="font-size: clamp(1rem,1.2vmax,2rem)">
            Ask anything about Zack & Lacey's relationship and get an honest answer from a neutral perspective...
          </p>
          {/if}
          
    {#if responseContent !== ''}
      <div class="flex md:flex-row absolute mt-5  md:top-10 !2xl:px-24 w-full" >
        <div bind:this={typieElement} class="gradient-mask  px-1 !2xl:px-20 pt-28 2xl:pt-20 h-[95vh] lg:h-[90vh]  w-full" style="padding: clamp(5.1em, 10vw, 55rem) clamp(0.1rem, 4vw, 65rem);">
          <h1 class="!font-thin dropcap  subpixel-antialiased text-{foregroundColor}" style="font-family: Diabolique; font-size: clamp(10em, 15vw, 50em); ">{responseDropCap.toLocaleLowerCase()}</h1>
        <Typewriter keepCursorOnFinish={true} mode="cascade" interval={8}>
          <h1 class="typie {foregroundColor === 'white' ? 'visible' : 'visible'} text-{foregroundColor}   z-30 -pt-8 " style="line-height: clamp(1.2em, 2vw, 10em)">{responseContent}</h1><br>
        </Typewriter>
        </div>
      </div>
    {:else}
          <Typewriter keepCursorOnFinish={true} mode="concurrent" interval={8} unwriteInterval={30} wordInterval={1500}>
            <h1 class="typie  leading-9  text-md xl:text-xl whitespace-pre z-30" style="--gradient-style: {gradientStyle};">{message}</h1><br>
          </Typewriter>
    {/if}
		<div class="container h-full mx-auto flex justify-center items-center mt-[-12vmax] xl:mt-[-5vmax]"> 
			<input class="c-checkbox" type="checkbox" id="checkbox">
      
			<div class="c-formContainer contents">
        {#if mounted}
        <form in:fade={{delay: 1750, duration: 3500}} class="c-form relative" action="" autocomplete='off' id="form-container" on:pointerenter={handleMouseOver}  on:pointerleave={handleMouseOut} style="height: clamp(1em, 15%, 5em); width: clamp(18em, 80%, 50em); padding: 5px; ">
          
          <input class="c-form__input" bind:this={inputElement} title="queryInput" id="queryInput" bind:value={queryInput} on:focus={handleMouseOver} spellcheck="false" on:pointerenter={handleMouseOver} on:pointerdown={handleMouseOver}  style="font-size: clamp(1.35rem, 1.8vmax, 2.5rem); { wavy ? 'filter:url(#wavy); margin-right: 5px; margin-bottom: 15px; color: rgb(207, 12, 12, 0.0); ' : '' } "  placeholder="{ wavy ? '' : '...don\'t be shy...'}" type="website" required pattern="^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$">
          <p class="absolute w-full h-fit p-6  text-{backgroundColor} {backgroundColor === 'black' ? 'visible' : 'invisible'} pointer-events-none" style="font-size: clamp(1.5rem, 1.9vmax, 4rem)">{queryInput}</p>
          <label class="c-form__buttonLabel" for="checkbox" >
          </label>
          <button class="c-form__buttonLabel" type="submit"  on:click={handleDeconstructClick}  >
            <div  style="height: 100%; width: auto; max-width:70px">
              <svg id="paper-plane" height="512" viewBox="0 0 500 500" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m465.491 485.57c-37.651.467-75.445 4.325-113.063 2.255-36.822-3.336-73.858-10.676-110.919-6.577-18.765 2.076-37.489 4.687-56.18 7.368a3.655 3.655 0 0 0 -2.056-.28 11.732 11.732 0 0 1 -10.162-3.608c-6.233-6.318-9.712-17.931-12.493-24.347q-8.189-18.118-17.879-35.509a457.821 457.821 0 0 0 -31.762-49.387c-3.142-4.215-6.834-8.178-8.855-13.078 25.135-5.306 39.443 21.507 51.443 39.379 5.208 7.866 31.936 48.022 40.5 46.56 46.328-9.92 90.394-44.561 139.193-36.213 9.124 2.284 16.81 8.389 26.053 10.177 9.375 1.813 19.548.706 29.023.306 23.116-.975 46.159-3.141 69.187-5.305 4.611-.434 4.656-7.7 0-7.258-22.124 1.52-78.442 10.195-93.446-7.613-56.894-54.677-120.673-4.394-181.807-76.575a2.94 2.94 0 0 0 -4.72.168c-12.212 14.028-2.487 37.589 8.862 49.561 12.841 13.745 30.752 23.161 47.449 31.923-15.864 8.373-30.437 18.888-46.824 26.239a10.369 10.369 0 0 1 -1.69-.552c-10.305-12.984-19.775-26.319-28.9-40.1-6.976-10.605-13.631-21.8-23.869-29.631-9.792-7.492-23.9-11.369-35.393-5.528a2.487 2.487 0 0 0 -1.414 1.644c-1.494 6.388 4.155 12.37 7.63 17.2 6.785 9.413 13.393 18.957 19.565 28.785-19.242-15.2-50.189-28.059-72.43-12.03a2.689 2.689 0 0 0 -.67 3.305c-.407 4.352 13.41 9.292 16.938 11.735q12.845 7.149 25.19 15.153c-18.618-3.244-53.414-6.112-56.274 19.676a2.42 2.42 0 0 0 2.394 2.53c11.349 2.34 23.2 1.668 34.669 3.827a189.853 189.853 0 0 1 20.441 4.956c-12.761.565-34.751 4.341-36.694 20.162-.541 1.729.325 3.865 2.667 3.76a297.732 297.732 0 0 1 115.06 15.386c6.33 2.747 14.234.618 20.757-1.231 13.257-1.44 26.5-2.985 39.75-4.494 37.188-4.5 74.268 1.468 111.2 5.631 39.758 3.265 79.7-1.36 119.523-1.769 4.242-.141 4.262-6.742.006-6.601zm-422.191-45.118c10.479-19.987 46.766-10.095 64.451-5.919 15.449 10.967 29.449 23.667 43.249 36.508-33.542-16.31-69.65-31.925-107.7-30.589zm26.449-38.6c-3.207-1.712-6.515-3.6-9.924-5.142 28.78-10.563 54.735 11.586 75.236 29.129 6.853 12.108 13.107 24.551 18.845 37.219a385.249 385.249 0 0 0 -84.162-61.207z"/><path d="m38.9 14.43c37.651-.467 75.445-4.325 113.063-2.255 36.821 3.336 73.858 10.676 110.918 6.577 18.765-2.076 37.489-4.687 56.18-7.368a3.665 3.665 0 0 0 2.056.28 11.731 11.731 0 0 1 10.162 3.608c6.233 6.318 9.712 17.931 12.494 24.347q8.188 18.118 17.879 35.509a457.66 457.66 0 0 0 31.761 49.387c3.142 4.215 6.835 8.178 8.855 13.078-25.135 5.307-39.443-21.507-51.442-39.379-5.208-7.866-31.937-48.022-40.5-46.56-46.329 9.92-90.4 44.561-139.193 36.213-9.125-2.284-16.81-8.389-26.054-10.177-9.375-1.813-19.547-.706-29.022-.306-23.117.975-46.159 3.141-69.188 5.3-4.61.434-4.656 7.7 0 7.258 22.124-1.52 78.442-10.2 93.447 7.612 56.893 54.677 120.672 4.395 181.807 76.576a2.94 2.94 0 0 0 4.72-.168c12.212-14.028 2.486-37.588-8.863-49.561-12.841-13.745-30.751-23.162-47.448-31.923 15.868-8.369 30.437-18.878 46.824-26.234a10.358 10.358 0 0 1 1.689.552c10.305 12.984 19.775 26.319 28.9 40.1 6.975 10.6 13.63 21.8 23.868 29.631 9.792 7.492 23.9 11.369 35.393 5.528a2.483 2.483 0 0 0 1.414-1.644c1.494-6.388-4.155-12.37-7.63-17.2-6.785-9.413-13.392-18.957-19.565-28.785 19.243 15.2 50.189 28.059 72.43 12.03a2.691 2.691 0 0 0 .671-3.3c.407-4.352-13.411-9.292-16.938-11.735q-12.846-7.149-25.191-15.153c18.618 3.244 53.414 6.112 56.275-19.676a2.421 2.421 0 0 0 -2.394-2.53c-11.35-2.34-23.2-1.668-34.669-3.827a189.813 189.813 0 0 1 -20.442-4.956c12.762-.565 34.751-4.341 36.694-20.162.541-1.729-.325-3.865-2.666-3.76a297.727 297.727 0 0 1 -115.064-15.392c-6.331-2.747-14.231-.619-20.758 1.235-13.256 1.44-26.5 2.984-39.75 4.493-37.188 4.5-74.268-1.467-111.2-5.63-39.761-3.269-79.702 1.356-119.523 1.764-4.24.143-4.26 6.744 0 6.603zm422.2 45.117c-10.48 19.988-46.767 10.1-64.452 5.92-15.462-10.967-29.459-23.667-43.261-36.508 33.542 16.31 69.65 31.925 107.706 30.588zm-26.45 38.6c3.207 1.712 6.515 3.6 9.924 5.142-28.779 10.563-54.735-11.586-75.236-29.129-6.853-12.108-13.106-24.551-18.844-37.219a385.22 385.22 0 0 0 84.149 61.208z"/><path d="m58.865 235.71a37.119 37.119 0 0 1 -15.573 3.237c-5.109.065-5.334 7.678-.186 8a85.712 85.712 0 0 1 9.6 1.045c7.911 1.364 14.348 10.458 16.018 22.628 1.189 8.681 3.072 27.191 3.091 27.377.5 4.7 7.451 4.758 7.959 0 .018-.186 1.9-18.7 3.091-27.376 1.669-12.171 8.106-21.264 16.016-22.629a85.838 85.838 0 0 1 9.606-1.045c5.192-.33 4.925-8.067-.33-7.993a37.322 37.322 0 0 1 -15.427-3.239c-5.35-2.408-9.7-9.494-10.576-17.232-1.115-9.817-2.356-28.752-2.369-28.942-.357-4.888-7.614-4.945-7.982 0-.013.19-1.253 19.123-2.367 28.942-.873 7.733-5.223 14.817-10.571 17.227z"/><path d="m422.063 279.526c-.357-4.887-7.615-4.945-7.983 0-.012.189-1.253 19.123-2.367 28.941-.878 7.738-5.227 14.825-10.576 17.232a37.47 37.47 0 0 1 -15.429 3.24c-5.175-.079-5.584 7.645-.33 7.993a85.634 85.634 0 0 1 9.607 1.045c7.91 1.364 14.346 10.457 16.016 22.628 1.191 8.681 3.073 27.19 3.091 27.376.5 4.7 7.451 4.758 7.959 0 .019-.186 1.9-18.7 3.092-27.376 1.669-12.171 8.105-21.264 16.016-22.628a85.465 85.465 0 0 1 9.606-1.045c5.194-.327 4.922-8.082-.329-7.993a37.425 37.425 0 0 1 -15.429-3.24c-5.349-2.407-9.7-9.493-10.576-17.232-1.114-9.816-2.355-28.751-2.368-28.941z"/><path d="m206.878 214.009a4 4 0 0 0 -1.787-5.367c-17.227-7.833-69.933-36.611-74.44-25.4-8 11.39 66.255 51.851 81.116 61.487a43.264 43.264 0 0 0 5.439 28.1c-17.315 7.772-29.991 12.248-36.4 13.52 2.728-2.709 8.337-7.424 19.8-15.032 4.327-2.973.011-9.5-4.424-6.666-8.672 6.266-29.593 18.611-25.239 26.872 5.4 9.973 38.947-7.3 51.029-12.073 14.479 17.622 43.811 19.853 60.813 4.311 16.238 7.421 82.758 44.62 88.06 32.326 6.669-9.227-38.817-35.055-53.158-44.694-4.5-2.687-8.649 3.942-4.215 6.8 25.782 15.984 39.371 25.95 45.65 31.417-10.611-3.223-33.555-12.832-70.576-31.87a42.93 42.93 0 0 0 8.887-21.18 4 4 0 0 0 -7.936-1.01 34.981 34.981 0 0 1 -8.209 18.43q-5.546-2.894-11.465-6.042c-4.683-2.393-8.36 4.513-3.76 7.062q4.512 2.4 8.941 4.719c-13.2 10.041-34.21 8.156-45.406-3.8 17.646-8.413 110.257-54.636 101.549-69.191-2.27-4.288-8.243-5.181-30.968 3.592a4 4 0 1 0 2.881 7.463c9.452-3.648 15.043-5.183 18.259-5.808-4.29 4.222-13.8 11.3-27.883 20.153-16.254-34.5-67.585-31.037-79.658 4.507-37.146-21.772-61.757-38.545-71.4-46.891 8.792 2.67 26.909 9.915 59.136 26.042a4 4 0 0 0 5.364-1.777zm47.661 1.808a35.031 35.031 0 0 1 32.027 20.559c-8.751 5.319-20.2 11.817-31.541 17.839a11.127 11.127 0 0 1 -10.623-.1c-8.176-4.543-16.237-9.117-23.563-13.356a35.3 35.3 0 0 1 33.7-24.942zm-35.185 33.313c7.055 4.063 14.327 8.174 21.744 12.292q-8.781 4.425-16.583 8.061a35.12 35.12 0 0 1 -5.161-20.353z"/><path d="m241.379 172.424c1.028-5.672-7.381-7.344-8.6-1.711-1.029 5.672 7.38 7.344 8.6 1.711z"/><path d="m127.406 241.683c-1.028 5.673 7.381 7.344 8.6 1.711 1.029-5.672-7.38-7.344-8.6-1.711z"/><path d="m273.281 328.442c-1.029 5.672 7.381 7.343 8.6 1.71 1.029-5.672-7.381-7.344-8.6-1.71z"/><path d="m374.745 250.025c5.672 1.028 7.344-7.382 1.711-8.6-5.672-1.025-7.344 7.38-1.711 8.6z"/><path d="m460.237 375.361c5.672 1.028 7.344-7.381 1.711-8.6-5.672-1.029-7.348 7.38-1.711 8.6z"/><style type="text/css">
              path{
                cursor:pointer;
              }
              svg {
                padding-left: 5px !important;

              }
            </style>
            <path d="m74.944 144.858c5.672 1.028 7.344-7.381 1.711-8.6-5.672-1.029-7.344 7.38-1.711 8.6z"/>
            <path d="m31.411 316.138c-1.028 5.672 7.382 7.344 8.6 1.711 1.029-5.672-7.38-7.344-8.6-1.711z"/>
            <path d="m434.718 204.319c1.028-5.672-7.382-7.344-8.6-1.711-1.029 5.673 7.382 7.344 8.6 1.711z"/></svg>
          </div>
        </button>
        <label class="c-form__toggle" for="checkbox" data-title="Ask & Learn" id="b" 
        on:focus={handleMouseOver}
        on:blur={handleMouseOut}
          on:pointerenter={handleMouseOver} 
          on:pointerdown={handleMouseOver} 
          on:pointerup={handleMouseOut} 
          on:pointerleave={handleMouseOut}  
          on:click={() => {handleMouseOut; message = "...how about your website?"}}	
          on:mouseover={handleMouseOver} 
          on:mouseout={handleMouseOut} style="background: conic-gradient(from calc(var(--r2) - 35deg) at var(--x) 800px, {backgroundColor} 0%, {foregroundColor} 20%, #999 1%, {backgroundColor} 35%); { wavy ? 'filter:url(#wavy); padding-right: 5px; padding-bottom: 5px' : '' }">
            <div class="c-form__toggle-circle"></div>
          </form>
        {/if}
      </div>
    </div>
</div>

<!-- the nav menu -->
<!-- {#if responseContent !== ''}
  <div class=" absolute left-10 bottom-8 menu-column align-center h-fit md:p-14 p-4"

  on:pointerenter={handleMouseOver2} 
  on:pointerleave={handleMouseOut2} >
        
        <DynamicMenu {menuItems} on:menuClick={handleMenuClick} textColor={"text-black"} />
  </div>

  <div class="content-column ">
    {#if selectedContent}
        <article>{selectedContent}</article>
    {/if}
  </div>
{/if} -->
<div class="flex">
  <div class="absolute bottom-14 right-14 sm:bottom-20 sm:right-20 2xl:bottom-52 2xl:right-52 -mb-4 z-30  h-20 w-20" >
    <a href="/" on:click={() => location.reload()}>
      <Fire />
    </a>
  </div>
</div>
</div>

<svg class:wavy={makeWavy} style="position:absolute; padding:10px">
	<defs>
		<filter id="wavy" x="0" y="0" width="110%" height="110%">
			<feTurbulence id="sea-filter" numOctaves="6" seed="2" baseFrequency="0.4 0.9" />
			<feDisplacementMap scale="15" in="SourceGraphic" />
			<!--     https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animate -->
			    <!-- <animate xlink:href="#sea-filter" attributeName="baseFrequency" dur="60s" keyTimes="0;0.5;1" values="0.02 0.06;0.04 0.08;0.02 0.06" repeatCount="indefinite" /> -->
			<animate
				xlink:href="#sea-filter"
				attributeName="baseFrequency"
				dur="60s"
				keyTimes="0;0.5;1"
				values="0.02 0.06;0.04 0.08;0.02 0.06"
				repeatCount="indefinite"
				calcMode="spline"
				keySplines="0.25 0 0.75 1;0.25 0 0.75 1"
			/>
		</filter>
	</defs>
</svg>
<audio id="scrollSound" src="/audio/chirp.mp3" preload="auto"  autoplay muted></audio>

<style>

 ::selection, ::-moz-selection {
	/* change highlight selection to black with white text */
	--selection-background-color: #000 !important;
	--selection-color: #fff;

 }
 .dropcap {
  float: left;
  shape-outside: circle(50%);
  shape-margin: 0rem;
  padding-bottom: clamp(0.25em, .25em, 8rem);
  padding-right: clamp(0.5rem, .15em, 5rem);

 }
 .gradient-mask {
    /* Adjust these gradient values as per your requirement */
    mask-image: linear-gradient(to bottom, black 80%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent);
  }
 .menu-column  {
  font-family: HK Black ;
  font-size:  clamp(1.25rem, 1.5vmax, 4rem) !important;
 }
 .typie {
	transition: color .2s ease;
	visibility: hidden;
  font-size:  clamp(1rem, 1.5vmax, 4rem) !important;
  /* margin: clamp(1rem, 1.5vw, 65rem) clamp(1rem, 1.5vw, 65rem); */

 }
 .c-form:hover #paper-plane path {
    fill: #fff !important;
 }


 .c-form {
  transition: width 5s ease;
 }


.typie.visible {
  visibility: visible;
}
#boxie {
  margin: clamp(1rem, 1.5vw, 65rem);

		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: inherit;
		transition: background-color .2s ease, border .3s ease;
		
	}

	.biggie {
		width: 100%;
		height: 100%;
		transition: background-color .1s ease;
	}

.c-checkbox {
  display: none;
}
.c-checkbox:checked + .c-formContainer .c-form {
  box-shadow: 0 0.125em 0.3125em rgba(0, 0, 0, 0.3);
}
.c-checkbox:checked + .c-formContainer .c-form__toggle {
  visibility: hidden;
  opacity: 0;
  transform: scale(0.7);
}
.c-checkbox:checked + .c-formContainer .c-form__input,
.c-checkbox:checked + .c-formContainer .c-form__buttonLabel {
  transition: 0.2s 0.1s;
  visibility: visible;
  opacity: 1;
  transform: scale(1);
}
.c-checkbox:not(:checked) + .c-formContainer .c-form__input:required:valid ~ .c-form__toggle::before, .c-checkbox:checked + .c-formContainer .c-form__input:required:valid ~ .c-form__toggle::before {
  content: "Thank You! 😊";
}
.c-checkbox:not(:checked) + .c-formContainer .c-form__input:required:valid ~ .c-form__toggle::before, .c-checkbox:checked + .c-formContainer .c-form__input:required:valid  #b::after {
  display: none;
}
.c-checkbox:not(:checked) + .c-formContainer .c-form__input:required:valid ~ .c-form__toggle {
  pointer-events: none;
  cursor: default;
}

.c-formContainer,
.c-form,
.c-form__toggle {
  width: clamp(17em, 60vw, 125em);
  height: clamp(10em, 20vh, 125em);
}
#paper-plane {
  height: 100%;
  width: 100%;
  margin: auto;
  padding: 0px;
}


#paper-plane:active {
  transform: scale(0.9);
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1)
}
.c-formContainer {
  position: relative;
  font-family: HK Black;
}

.c-form,
.c-form__toggle {
  position: absolute;
  border-radius: 0em;
  background-color: whitefff;
  transition: .2s;
}

.c-form {
  padding: 0.625em;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.c-form__toggle {
  color: black;
  top: 0;
  cursor: pointer;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.c-form__toggle::before {
  font-size: 1.75em;
  content: attr(data-title);
}

.c-form__input,
.c-form__button {
  font: inherit;
  border: 0;
  outline: 0;
  border-radius: 0em;
  box-sizing: border-box;
}

.c-form__input,
.c-form__buttonLabel {
	font-family: HK Regular;
  opacity: 0;
  visibility: hidden;
  transform: scale(0.7);
  transition: 0s;
  color: white;
}

.c-form__input {
font-size:  clamp(.9rem, 1vw, 2rem);
  color: #999;
  height: 100%;
  width: 100%;
  padding: 0 0.714em;
}
.c-form__input::placeholder {
  color: currentColor;
}
.c-form__input:required:valid {
  color: black;
}
.c-form__input:required:valid + .c-form__buttonLabel {
  color: whitefff;
}
.c-form__input:required:valid + .c-form__buttonLabel::before {
  pointer-events: initial;
}

.c-form__buttonLabel {
	font-family: HK Regular;
  color: white;
  height: 100%;
  width: auto;
}
.c-form__buttonLabel::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  cursor: pointer;
}
#b::after {
  content: "Ask & Learn";
  line-height: 1em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
  font-family: HK Black;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: clamp(2.75em, 4.5vmax, 20em);
  position: absolute;
  background: white;
  inset: 1px;
  border-radius: 0px;
  transition: all .5s ease;
}

#b:hover::after {
  padding-right: 8px;
  padding-bottom: 3px;
}


/* better version */

@property --r2 {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@property --x {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}


#b {

  animation: -5.64s rotating2 10s linear infinite, -5.64s x 10s linear infinite;
}

#b:hover::after {
  color: white;
  background:black;
  transition: all .5s ease;
}



@keyframes x {
  /* w:h === 6:1 */
  /* with a 80px x-margin */
  0% {
    --x: 20px;
  }
  /* 6/(6+3.14) * 50% */
  32.82275711% {
    --x: 220px;
  }
  50% {
    --x: 420px;
  }
  /* 50% + 32.8% */
  82.82275711% {
    --x: 220px;
  }
  100% {
    --x: 20px;
  }
}

@keyframes rotating2 {
  0% {
    --r2: 0deg;
  }
  32.82275711% {
    --r2: 40deg;
  }
  50% {
    --r2: 120deg;
  }
  82.82275711% {
    --r2: 190deg;
  }
  100% {
    --r2: 360deg;
  }
}

</style>