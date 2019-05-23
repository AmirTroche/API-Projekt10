const STORAGE_KEY = 'bucket-storage';
new Vue({
    /* startar vue och ansluter till classen */
  el: '.bucketapp',
    /* data retunerar */
  data () {
    return {
       newBucket: " ",
       bucketlist: []
        

    }
  },
    /*reapet(loop) på instancer*/
    created(){
        this.bucketlist = JSON.parse(localStorage.getItem(STORAGE_KEY )|| "[]");
},
    methods: { 
    addBucketlist(){
        this.bucketlist.push({title: this.newBucket, id:this.bucketlist.length})
        /*rensar user input field */
        this.newBucket = " ";
        /*sparar user input, i local storage så den inte försvinner när man updaterar hemsidan */
        localStorage.setItem(STORAGE_KEY,JSON.stringify(this.bucketlist));
    },
        /*tar bort ett valt item i listan*/
        removeBucket(bucket){
            this.bucketlist.splice(this.bucketlist.indexOf(bucket), 1);
            localStorage.setItem(STORAGE_KEY,JSON.stringify(this.bucketlist));
        }
    }
});
