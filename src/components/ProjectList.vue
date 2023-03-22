<script setup>
import {onMounted} from 'vue'
import {reactive, ref, computed} from 'vue'
import demoData from '@/assets/data/project_list.json'

let listItems = []
let uniqueID = 0
demoData.project_list.forEach((item) =>
	listItems.push({...item, id: uniqueID++})
)
const filteredListItems = reactive({arr: [...listItems]})

onMounted(() => {
	//Set height for the scrollable list to fill the remaining height of the screen (for scrolling only inside the list instead of the entire site)
	const t = document.getElementById('list')
	const rect = t.getBoundingClientRect()
	var body = document.body,
		html = document.documentElement
	var height = Math.max(
		body.scrollHeight,
		body.offsetHeight,
		html.clientHeight,
		html.scrollHeight,
		html.offsetHeight
	)
	t.style.height = `${height - rect.top - 15}px`
})

let filterInput = ref('')
function filterItems(term) {
	if (term.length == 0) {
		filteredListItems.arr = [...listItems]
		return
	}
	let filteredArray = listItems.filter(
		(item) =>
			item.project_name
				?.replace(/ /g, '')
				.toLowerCase()
				.includes(term.replace(/ /g, '').toLowerCase()) ||
			item.project_number
				?.replace(/ /g, '')
				.toLowerCase()
				.includes(term.replace(/ /g, '').toLowerCase())
	)

	filteredListItems.arr = [...filteredArray]
}
function cancelFilterItems() {
	filterInput.value = ''
	filteredListItems.arr = [...listItems]
}

function deleteItem(item, index) {
	filteredListItems.arr.splice(index, 1)
	listItems = listItems.filter((el) => el.id !== item.id)
}

const sortBy = {
	none: 0,
	name_asc: 1,
	name_desc: 2,
	number_asc: 3,
	number_desc: 4,
	client_asc: 5,
	client_desc: 6,
	searcher_asc: 7,
	searcher_desc: 8,
}
const sortCategory = {
	name: 0,
	number: 1,
	client: 2,
	searcher: 3,
}
let currentSort = ref(0)

const sortIconName = computed(() => getIcon(1))
const sortIconNumber = computed(() => getIcon(3))
const sortIconClient = computed(() => getIcon(5))
const sortIconSearcher = computed(() => getIcon(7))
function getIcon(i){
    let out = "fa-solid fa-sort"
    switch (currentSort.value) {
        case i:
            out+="-up"
            break;
        case i+1:
            out+="-down"
            break;
        default:
            break;
    }
    return out
}

function sortClick(el){
    let t = 0
    switch (el) {
        case 0:
            if(currentSort.value == sortBy.name_asc){t=sortBy.name_desc; sortListBy("project_name", false)}
            else if (currentSort.value == sortBy.name_desc){t=sortBy.none}
            else{t=sortBy.name_asc; sortListBy("project_name", true)}
            break;
        case 1:
            if(currentSort.value == sortBy.number_asc){t=sortBy.number_desc; sortListBy("project_number", false)}
            else if (currentSort.value == sortBy.number_desc){t=sortBy.none}
            else{t=sortBy.number_asc; sortListBy("project_number", true)}
            break;
        case 2:
            if(currentSort.value == sortBy.client_asc){t=sortBy.client_desc; sortListBy("client", false)}
            else if (currentSort.value == sortBy.client_desc){t=sortBy.none}
            else{t=sortBy.client_asc; sortListBy("client", true)}
            break;
        case 3:
            if(currentSort.value == sortBy.searcher_asc){t=sortBy.searcher_desc; sortListBy("patent_searcher", false)}
            else if (currentSort.value == sortBy.searcher_desc){t=sortBy.none}
            else{t=sortBy.searcher_asc; sortListBy("patent_searcher", true)}
            break;
        default:
            break;
    }
    currentSort.value = t
    if(t===0){resetSortListBy()}
}
function sortListBy(key,reverse=false) {
    let sortedArray = listItems.sort((a,b)=> {
        if(!a[key]) return 1
        if(!b[key]) return -1
        if(a[key] < b[key]) return reverse ? -1 : 1
        else return reverse ? 1 : -1
    })
    listItems = sortedArray
    filterItems(filterInput.value)
}

function resetSortListBy() {
    sortListBy('id', true)
    currentSort.value = 0
}



// Demo Add functionality
// Cycles around the demo data to add to the list
let demoIndex = 0
function addItem() {
	demoIndex = demoIndex < demoData.project_list.length - 1 ? demoIndex + 1 : 0
	const item = demoData.project_list[demoIndex]
	const id = uniqueID++
	filteredListItems.arr.unshift({...item, id})
	listItems.unshift({...item, id})
}
</script>

<template>
	<div class="container">
		<h1 class="title">Your Projects</h1>
		<div class="search">
			<input
				type="text"
				class="search__input"
				placeholder="Please enter a project name or a project number"
				v-model="filterInput"
				@input="(e) => filterItems(e.target.value)"
			/>
			<button
				class="search__button"
				v-if="filterInput.length > 0"
				@:click="() => cancelFilterItems()"
			>
				<font-awesome-icon icon="fa-solid fa-xmark" />
			</button>
		</div>

		<div class="sort">
			<button class="sort__item"
                @:click="()=>sortClick(sortCategory.name)" 
            >
				<p class="sort__title">Project-Name</p>
				<font-awesome-icon class="sort__icon" :icon="sortIconName" />
			</button>
			<button class="sort__item"
                @:click="()=>sortClick(sortCategory.number)"
            >
				<p class="sort__title">Project-Number</p>
				<font-awesome-icon class="sort__icon"  :icon="sortIconNumber" />
			</button>
			<button class="sort__item"
                @:click="()=>sortClick(sortCategory.client)"
            >
				<p class="sort__title">Client</p>
				<font-awesome-icon class="sort__icon"  :icon="sortIconClient" />
			</button>
			<button class="sort__item"
                @:click="()=>sortClick(sortCategory.searcher)"
            >
				<p class="sort__title">Patent Searcher</p>
				<font-awesome-icon class="sort__icon"  :icon="sortIconSearcher" />
			</button>
			<p class="sort__item">
				<p class="sort__title">Management</p>
			</p>
		</div>
		<div class="add">
			<button class="add__button" @:click="() => addItem()">
				<font-awesome-icon
					class="add__button__icon"
					icon="fa-solid fa-plus"
				/>
			</button>
		</div>
		<div class="list" id="list">
			<div
				v-for="(item, index) in filteredListItems.arr"
				class="list__item"
			>
				<p class="list__item__text">{{ item.project_name }}</p>
				<p class="list__item__text">{{ item.project_number }}</p>
				<p class="list__item__text">{{ item.client }}</p>
				<p class="list__item__text">{{ item.patent_searcher }}</p>
				<div class="list__item__button-container">
					<button
						class="list__item__button"
						@:click="() => deleteItem(item, index)"
					>
						<font-awesome-icon
							class="list__item__button__icon"
							icon="fa-regular fa-trash-can"
						/>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/colors' as c;
.container {
	position: fixed;
	inset: 70px 0 0 70px;

	background-color: c.$background;
	border-radius: 35px 0 0 0;
	padding: 2rem 4rem;
}

.search {
	display: flex;
	align-items: center;
	&__input {
		height: 2rem;
		width: 50%;
		margin: 1rem 0;

		outline: none;
		border: none;
		background: transparent;
		border-bottom: 2px solid c.$text-mute;

		font-size: 1rem;
		line-height: 1.5;
		color: c.$text;
	}

	&__button {
		cursor: pointer;
		width: 2rem;
		height: 2rem;
		font-size: 1.5rem;
		background-color: transparent;
		color: c.$accent-blue;
		border: none;
	}
}

.sort {
	display: flex;
	margin-right: 2.5rem;

	&__item {
		flex: 3 3 0px;
		padding: 0;
		border: none;
		display: flex;
		align-items: center;
		gap: 0.25rem;

		font-size: 1rem;
		font-weight: bold;
		&:last-child {
			flex: 1 1 0px;
		}
        user-select: none;

	}
    button {
            cursor: pointer;
        }
}

.add {
	display: grid;
	place-content: center;
	margin: 0.5rem;
	min-height: 5rem;

	outline: 4px dotted c.$background-light;
	border-radius: 15px;
	&__button {
		cursor: pointer;
		display: grid;
		place-content: center;

		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		border: 4px solid c.$accent-blue;
		color: c.$accent-blue;

		&__icon {
			font-size: 2rem;
			margin-left: 0.15rem;
		}
	}
}

.list {
	margin: 1rem 0;
	padding: 0 1rem 0 0;
	overflow-y: scroll;

	display: flex;
	flex-direction: column;
	gap: 1rem;

	&__item {
		display: flex;
		align-items: center;
		min-height: 5rem;
		padding: 1rem 0 1rem 1rem;

		background: c.$background-light;
		border-radius: 15px;

		p {
			flex: 3 3 0px;
		}
		.list__item__button-container {
			flex: 1 1 0px;
			display: grid;
			place-content: center;
		}

		&__button {
			cursor: pointer;
			width: 2rem;
			height: 2rem;

			border-radius: 50%;
			border: 2px solid c.$accent-blue;
			color: c.$accent-blue;
			background-color: c.$background-light;
		}
		&:hover {
			background-color: c.$accent-blue;
			color: c.$text-white;
		}
	}
}
</style>
