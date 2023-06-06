<template>
    <div class="app">
        <div class="content">
            <AppInfo
                :allMoviesCount="AllMovie"
                :favouriteMoviesCount="movies.filter(c=> c.favourite).length"/>
            <div class="search-panel">
                <SearchPanel :updateTermHandler="updateTermHandler"/>
                <AppFilter :updateFilterHandler="updateFilterHandler" :filterName="filter"/>
            </div>
            <Box v-if="!movies.length && !isLoading" class="text-center fw-bold ">Movies not fount</Box>
            <Box v-else-if="isLoading" class="text-center" ><Loader/></Box>
            <movieList 
                v-else
                :movies="onFilterHandler(onSearchHandler(movies,term),filter)" 
                @onToggle="onToggleHandler" 
                @onRemove="onRemoveHandler"
            />
            <Box class="d-flex justify-content-center">
                <nav aris-label="pagination">  
                    <ul class="pagination pagination-sm">
                        <li 
                            v-for="pageNumber 
                            in totelPages" 
                            :key="pageNumber" 
                            :class="{active: pageNumber === page}"
                            @click="changePageHandler(pageNumber)"    
                        >
                            <span class="page-link">{{ pageNumber }}</span>
                        </li>
                    </ul>
                </nav>
            </Box>
            <movieAddForm @createMovie="createMovie"/>
            <!-- :class="[filter == 'popular' && 'none']" -->
        </div>
    </div>
</template>

<script>
  import AppInfo from "@/components/App-info/AppInfo.vue";
  import SearchPanel from "@/components/search-panel/SearchPanel.vue";
  import AppFilter from "@/components/app-filer/AppFilter.vue";
  import movieList from "@/components/movie-list/movieList.vue";
  import movieAddForm from "@/components/movie-add-form/movieAddForm.vue";
  import axios from "axios"
  export default {
    components:{
        AppInfo,
        SearchPanel,
        AppFilter,
        movieList,
        movieAddForm,
    },
      data(){
          return {
              movies: [],
              AllMovie:0,
              term:'',
              filter:'all',
              isLoading:false ,
              limit: 10,
              page: 1,
              totelPages:0
          }
      },
      methods:{
          async createMovie(item){
            try{
                const response = await axios.post('https://jsonplaceholder.typicode.com/posts',item) 
                this.movies.push(response.data)
            }catch(error){
                alert(error.message)
            }
          },
          onToggleHandler({id,prop}) {
              this.movies = this.movies.map(item => {
                if (item.id == id) {
                    return {...item, [prop] : !item[prop]}
                }
                return item
              })
          },
          async onRemoveHandler(id){
            try{
                const response = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`) 
                console.log(response);
                this.movies = this.movies.filter(c=> c.id !== id)
            }catch(error){

            }
          },
          onSearchHandler(arr, term) {
            if(term.length == 0) {
                return arr
            }
            return arr.filter(c => c.name.toLowerCase().indexOf(term)> -1)
          },
          updateTermHandler(term) {
            this.term =term
          },
          onFilterHandler(arr, filter) {
            switch (filter) {
                case 'popular':
                    return arr.filter(c => c.like)
                case 'mostViewers':
                    return arr.filter(c => c.viewers > 500)
                default:
                    return arr
                }
          },
          updateFilterHandler(filter){            
            this.filter = filter
          },
          changePageHandler(page){
            this.page = page
        },
        async fetchMovie(){
            try {
                this.isLoading = true
                setTimeout(async () => {
                    const response = await axios.get("https://jsonplaceholder.typicode.com/posts",{
                        params:{
                            _limit: this.limit,
                            _page:this.page
                        }
                    })
                    const newArr = response.data.map(item =>({
                        id:item.id,
                        name:item.title,
                        like:false,
                        favourite:false,
                        viewers:item.id*10,
                    }))
                    this.totelPages = Math.ceil(response.headers['x-total-count'] / this.limit)
                    this.movies = newArr
                    this.AllMovie = response.headers['x-total-count']
                    this.isLoading = false                     
                }, 2500);
            }catch(error){
                alert(error.message);
            }  
          }
    },
    mounted(){
        this.fetchMovie()
    },
    watch : {
        page() {
            this.fetchMovie()
        }
    }
  }
</script>

<style>
  .app{
      height:100vh;
      color:black;
  }
  .content{
      width:1000px;
      min-height:700px;
      margin: 0 auto;
      padding: 5rem 0;
      background-color: lightgray;
  }
  .search-panel{
      margin-top:2rem;
      padding: 1.5rem;
      background-color: #fcfaf5;
      border-radius: 4px;
      box-shadow: 15px 15px 15px rgba(0,0,0,0.15);
  }
  .none {
    display: none;
  }
</style>