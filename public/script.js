/*global axios*/
/*global Vue*/
var app = new Vue({
  el: '#app',
  data: {
    games: [],
    playerFilter: null,
    timeFilter: null,
    recommendFilter: null,
  },
  computed: {
    filteredGames() {
      return this.games.filter(this.checkFilter)
    }
  },
  created() {
    this.getGames();
  },
  methods: {
    async getGames() {
      try {
        let response = await axios.get("/api/games");
        this.games = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    checkFilter(game) {
      var passed = true
      passed &= (!this.playerFilter) || (game.minPlayers <= this.playerFilter && game.maxPlayers >= this.playerFilter)
      passed &= (!this.timeFilter) || (game.time <= this.timeFilter)
      passed &= (!this.recommendFilter) || (game.recommendingUser == this.recommendFilter)
      return passed
    }

  }
});
