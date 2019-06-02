//Axios is a popular, promise-based HTTP client that sports an easy-to-use API and can be used in both the browser and Node.js.
const STORAGE_KEY = 'bucket-storage';
const search = Vue.component('search', {
    data: function () {
        return {
            authKey: "eaf010cce85c4bb288517e3b87388e2f08c34be83383273a4be5e2d6c82e8a21", //Unsplash användes istället för Instagram.
            images: [],
            newBucket: "",
            bucketlist: [],
            imagesTag: "",
            weatherapi: "9c8c299e51194d4fccc96d74b9ee514d",
            weather: {},
            weatherData: null
        }
    },
    created() {
        this.bucketlist = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); //.prase = "analyserar" en json sträng. I detta fall hämtar den item från LocalStorage
    },
    //pushar in ny element i listan
    methods: {
        addBucketlist() {
            this.bucketlist.push({
                title: this.newBucket,
                id: this.bucketlist.length
            })

            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bucketlist)); // vet inte hur jag ska förklara denna, 
        },
        //funktionen nedanför tar bort item samt bilder 
        removeBucket(bucket) {
            // console.log(bucket.title, this.imagesTag);
            if (bucket.title === this.imagesTag) {
                this.images = [];
                this.weather = {};
            }
            this.bucketlist.splice(this.bucketlist.indexOf(bucket), 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bucketlist));

        },
        // Funktion för att söka från Unsplash, hämtar de 
        search() {
            this.images = [];
            this.imagesTag = this.newBucket;
            axios
                .get(
                    'https://api.unsplash.com/search/photos?client_id=' + this.authKey + '&per_page=6&query=' + this.newBucket
                ).then(data => {
                    var data = data.data.results;
                    data.map((urls) => {
                        this.images.push(urls.urls.small);
                    });

                }).then(() => {
                    axios
                        .get(
                            'https://api.openweathermap.org/data/2.5/weather?q=' + this.newBucket + '&units=metric&appid=' + this.weatherapi
                        ).then((data) => {
                            // console.log(data.data)
                            this.weather = data.data;
                            this.weatherData = true;
                        }).catch((error) => {
                            // console.log(error)
                            this.weatherData = false;
                        })
                    this.newBucket = "";
                })
        },
        listClicked(val) {
            this.newBucket = val;
            this.search();
        },
    },
    mounted() {
        this.images = [];
        axios
            .get('https://api.unsplash.com/search/photos?client_id=' + this.authKey + '&per_page=6&query=' + this.$route.params.newBucket)
            .then(data => {
                var data = data.data.results;
                data.map((urls) => {
                    this.images.push(urls.urls.small);
                })
                this.imagesTag = this.$route.params.newBucket;
            }).then(() => {
                axios
                    .get('https://api.openweathermap.org/data/2.5/weather?q=' + this.$route.params.newBucket + '&units=metric&appid=' + this.weatherapi)
                    .then((data) => {
                        // console.log(data.data)
                        this.weather = data.data;
                        this.weatherData = true;
                    }).catch((error) => {
                        // console.log(error)
                        this.weatherData = false;
                    })
            });
    },
    template: `<div>
                    <section class="bucketapp">
                        <header class="header">
                            <h1>Bucket List</h1>
                            <input class="new-Bucketlist" v-model="newBucket" v-on:keyup.enter="addBucketlist();search()"
                                placeholder="Vart vill du resa?" autofocus>
                        </header>

                        <section class="main" v-show="bucketlist.length">
                            <ul class="bucket-list">
                                <li v-for="bucket in bucketlist" v-on:click="listClicked(bucket.title)" class="bucket">
                                    <div class="view">
                                        <label>{{ bucket.title}}</label>
                                        <button class="destroy" v-on:click.stop="removeBucket(bucket)"></button>
                                    </div>

                                </li>
                            </ul>
                            <ul class="bucket-list"></ul>
                        </section>
                        
                    </section>
                    <section class="bucketapp" style="margin-top:20px;" v-if="weatherData">
                            <header class="header">
                                <img :src="'http://openweathermap.org/img/w/' + weather.weather[0].icon + '.png'">
                            </header>
                            <section class="main">
                                <ul class="bucket-list">
                                    <li class="bucket">
                                        <div class="view">
                                        <p>Weather: {{weather.weather[0].main}}</p>
                                        </div>
                                    </li>
                                    <li class="bucket">
                                        <div class="view">
                                        <p>Description: {{weather.weather[0].description}}</p>
                                        </div>
                                    </li>
                                    <li class="bucket">
                                        <div class="view">
                                        <p>Max Temp: {{weather.main.temp_max}}</p>
                                        </div>
                                    </li>
                                    <li class="bucket">
                                        <div class="view">
                                        <p>Min Temp: {{weather.main.temp_min}}</p>
                                        </div>
                                    </li>
                                    <li class="bucket">
                                        <div class="view">
                                        <p>Humidity: {{weather.main.humidity}}</p>
                                        </div>
                                    </li>
                                </ul>
                            </section>
                    </section>
                    <div style="width: 90%;">
                        <div class="thumbnail" v-for="url in images">
                            <img :src="url">
                        </div>
                    </div>
                </div>`
});
/*Template förklaring: 
V-model = use the v-model directive to create two-way data bindings on form input, textarea, and select elements
V-On = Lyssnar direkt på events som triggar igång JS. Här så tar den bort item från lista
V-for =  för att göra en lista över objekt baserat på en array(listan i detta fall)
*/
const home = Vue.component('home', {
    data: function () {
        return {
            newBucket: "",
            bucketlist: [],
        }
    },
    created() {
        this.bucketlist = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    },
    methods: {
        addBucketlist() {
            this.bucketlist.push({
                title: this.newBucket,
                id: this.bucketlist.length
            })

            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bucketlist));
        },

        removeBucket(bucket) {
            this.bucketlist.splice(this.bucketlist.indexOf(bucket), 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bucketlist));
        },
        // Funktion till att söka från Unsplash
        search() {
            this.$router.push('/search/' + this.newBucket);
        },
        listClicked(val) {
            this.newBucket = val;
            this.search();
        }
    },
    template: `<section class="bucketapp">
				<header class="header">
					<h1>Bucket List</h1>
					<input class="new-Bucketlist" v-model="newBucket" v-on:keyup.enter="addBucketlist();search()" 
						placeholder="Vart vill du resa?" autofocus>
				</header>

				<section class="main" v-show="bucketlist.length">
					<ul class="bucket-list">
						<li v-for="bucket in bucketlist" v-on:click="listClicked(bucket.title)" class="bucket">
							<div class="view">
								<label>{{ bucket.title}}</label>
								<button class="destroy" v-on:click.stop="removeBucket(bucket)"></button>
							</div>

						</li>
					</ul>
					<ul class="bucket-list"></ul>
                </section>
            </section>`
})

//En vue funktion för Routes (vägar,paths)
const routes = [{
        path: '/search/:newBucket',
        component: search
    },
    {
        path: '/',
        component: home
    }
]
const router = new VueRouter({
    routes
})

new Vue({
    router,
    el: '#app',
});