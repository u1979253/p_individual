
new Vue({
    el: '#app',
    data: {
        players: []
    },
    mounted() {
        const playersString = localStorage.getItem('scoreMode2');
        if (playersString) {
            this.players = JSON.parse(playersString);
        }
        this.players.sort((a, b) => b.punts - a.punts);
this.players = this.players.slice(0, 10);
    }
})