/*global axios*/
/*global Vue*/
var app = new Vue({
  el: '#add',
  data: {
    title: "",
    file: null,
    addedGame: null,
    minPlayers: 2,
    maxPlayers: 6,
    time: 90,
    recommendingUser: ""
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0];
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async addGame() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name);
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/games', {
          title: this.title,
          imgPath: r1.data.path,
          minPlayers: this.minPlayers,
          maxPlayers: this.maxPlayers,
          time: this.time,
          recommendingUser: this.recommendingUser,
        });
        this.addedGame = r2.data;
      }
      catch (error) {
        console.log(error);
      }

    }
  }
});
